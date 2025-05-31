import unittest
import sys
import os
from datetime import datetime

# Adjust the path to include the project root directory
# This allows us to import modules from the 'app' directory
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from app.personal.projects import Proyecto, Tarea, crear_proyecto, agregar_tarea_a_proyecto

class TestProjects(unittest.TestCase):
    """
    Clase de pruebas para la funcionalidad de Proyectos y Tareas.
    """

    def test_prueba_inicial(self):
        """
        Una prueba simple para verificar que el entorno de pruebas funciona.
        """
        self.assertTrue(True)

    # --- Pruebas para la clase Tarea ---

    def test_crear_tarea_simple(self):
        """Prueba la creación de una tarea solo con el nombre."""
        nombre_tarea = "Hacer la compra"
        tarea = Tarea(nombre_tarea)
        self.assertEqual(tarea.nombre, nombre_tarea)
        self.assertIsNone(tarea.descripcion)
        self.assertFalse(tarea.completada)
        self.assertIsInstance(tarea.fecha_creacion, datetime)
        self.assertIsNone(tarea.fecha_limite)
        self.assertEqual(tarea.prioridad, 'media') # Asumiendo 'media' como default

    def test_crear_tarea_con_detalles(self):
        """Prueba la creación de una tarea con todos los detalles."""
        nombre = "Revisar correo"
        descripcion = "Revisar la bandeja de entrada principal y secundaria."
        fecha_limite = datetime(2024, 12, 1, 10, 0, 0)
        prioridad = "alta"

        tarea = Tarea(nombre, descripcion=descripcion, fecha_limite=fecha_limite, prioridad=prioridad)

        self.assertEqual(tarea.nombre, nombre)
        self.assertEqual(tarea.descripcion, descripcion)
        self.assertEqual(tarea.fecha_limite, fecha_limite)
        self.assertEqual(tarea.prioridad, prioridad)
        self.assertFalse(tarea.completada)
        self.assertIsInstance(tarea.fecha_creacion, datetime)

    def test_marcar_tarea_como_completada(self):
        """Prueba marcar una tarea como completada."""
        tarea = Tarea("Llamar al banco")
        self.assertFalse(tarea.completada, "La tarea no debería estar completada inicialmente.")
        tarea.completada = True
        self.assertTrue(tarea.completada, "La tarea debería estar marcada como completada.")

    def test_tarea_id_unico(self):
        """Prueba que dos tareas diferentes tengan IDs únicos."""
        tarea1 = Tarea("Tarea A")
        tarea2 = Tarea("Tarea B")
        self.assertNotEqual(tarea1.id, tarea2.id, "Los IDs de dos tareas diferentes no deberían ser iguales.")

    # --- Pruebas para la clase Proyecto ---

    def test_crear_proyecto_simple(self):
        """Prueba la creación de un proyecto solo con el nombre."""
        nombre_proyecto = "Vacaciones de Verano"
        proyecto = Proyecto(nombre_proyecto)
        self.assertEqual(proyecto.nombre, nombre_proyecto)
        self.assertIsNone(proyecto.descripcion)
        self.assertEqual(proyecto.tareas, [])
        self.assertIsInstance(proyecto.fecha_creacion, datetime)
        self.assertIsNone(proyecto.fecha_limite)
        self.assertEqual(proyecto.prioridad, 'media') # Asumiendo 'media' como default
        self.assertEqual(proyecto.progreso, 0.0)

    def test_crear_proyecto_con_detalles(self):
        """Prueba la creación de un proyecto con todos los detalles."""
        nombre = "Lanzamiento Producto X"
        descripcion = "Coordinar todas las fases del lanzamiento."
        fecha_limite = datetime(2025, 1, 15, 12, 0, 0)
        prioridad = "alta"

        proyecto = Proyecto(nombre, descripcion=descripcion, fecha_limite=fecha_limite, prioridad=prioridad)

        self.assertEqual(proyecto.nombre, nombre)
        self.assertEqual(proyecto.descripcion, descripcion)
        self.assertEqual(proyecto.fecha_limite, fecha_limite)
        self.assertEqual(proyecto.prioridad, prioridad)
        self.assertEqual(proyecto.tareas, [])
        self.assertIsInstance(proyecto.fecha_creacion, datetime)
        self.assertEqual(proyecto.progreso, 0.0)

    def test_proyecto_id_unico(self):
        """Prueba que dos proyectos diferentes tengan IDs únicos."""
        proyecto1 = Proyecto("Proyecto Alpha")
        proyecto2 = Proyecto("Proyecto Beta")
        self.assertNotEqual(proyecto1.id, proyecto2.id, "Los IDs de dos proyectos diferentes no deberían ser iguales.")

    def test_agregar_tareas_a_proyecto(self):
        """Prueba agregar tareas a un proyecto usando la función global."""
        proyecto = Proyecto("Mi Gran Proyecto")
        self.assertEqual(len(proyecto.tareas), 0)

        tarea1_nombre = "Definir requisitos"
        tarea1 = agregar_tarea_a_proyecto(proyecto, tarea1_nombre)
        self.assertEqual(len(proyecto.tareas), 1)
        self.assertEqual(proyecto.tareas[0].nombre, tarea1_nombre)
        self.assertEqual(proyecto.tareas[0].id, tarea1.id)

        tarea2_nombre = "Diseñar UI"
        tarea2_descripcion = "Crear mockups para la app"
        tarea2 = agregar_tarea_a_proyecto(proyecto, tarea2_nombre, descripcion_tarea=tarea2_descripcion)
        self.assertEqual(len(proyecto.tareas), 2)
        self.assertEqual(proyecto.tareas[1].nombre, tarea2_nombre)
        self.assertEqual(proyecto.tareas[1].descripcion, tarea2_descripcion)
        self.assertEqual(proyecto.tareas[1].id, tarea2.id)

        # Verificar que las tareas en el proyecto son las instancias correctas
        self.assertIn(tarea1, proyecto.tareas)
        self.assertIn(tarea2, proyecto.tareas)

    def test_calculo_progreso_proyecto(self):
        """Prueba el cálculo del progreso del proyecto."""
        proyecto = Proyecto("Proyecto de Cálculo")
        self.assertEqual(proyecto.progreso, 0.0, "Progreso debe ser 0.0 para proyecto sin tareas.")

        tarea1 = agregar_tarea_a_proyecto(proyecto, "Tarea Inicial")
        self.assertEqual(proyecto.progreso, 0.0, "Progreso debe ser 0.0 con una tarea no completada.")

        tarea1.completada = True
        self.assertEqual(proyecto.progreso, 100.0, "Progreso debe ser 100.0 con una tarea completada.")

        tarea2 = agregar_tarea_a_proyecto(proyecto, "Tarea Secundaria")
        self.assertEqual(proyecto.progreso, 50.0, "Progreso debe ser 50.0 con una tarea completada y una pendiente.")

        tarea2.completada = True
        self.assertEqual(proyecto.progreso, 100.0, "Progreso debe ser 100.0 con dos tareas completadas.")

        # Caso con dos tareas, ninguna completada
        proyecto_nuevo = Proyecto("Otro Proyecto")
        agregar_tarea_a_proyecto(proyecto_nuevo, "Tarea X")
        agregar_tarea_a_proyecto(proyecto_nuevo, "Tarea Y")
        self.assertEqual(proyecto_nuevo.progreso, 0.0, "Progreso debe ser 0.0 con dos tareas no completadas.")

    def test_proyecto_sin_tareas_progreso_cero(self):
        """Prueba que un proyecto sin tareas tiene progreso 0.0."""
        proyecto_vacio = Proyecto("Proyecto Vacío")
        self.assertEqual(proyecto_vacio.progreso, 0.0)

    # --- Pruebas para las funciones del módulo projects.py ---

    def test_funcion_crear_proyecto(self):
        """Prueba la función crear_proyecto."""
        nombre_proyecto_simple = "Proyecto Simple"
        p_simple = crear_proyecto(nombre_proyecto_simple)
        self.assertIsInstance(p_simple, Proyecto)
        self.assertEqual(p_simple.nombre, nombre_proyecto_simple)
        self.assertIsNone(p_simple.descripcion)
        self.assertIsNone(p_simple.fecha_limite)
        self.assertEqual(p_simple.prioridad, 'media')
        self.assertEqual(len(p_simple.tareas), 0)

        nombre_completo = "Proyecto Detallado"
        desc_completo = "Descripción detallada"
        fl_completo = datetime(2025, 5, 20)
        pri_completo = "baja"
        p_completo = crear_proyecto(nombre_completo, descripcion=desc_completo, fecha_limite=fl_completo, prioridad=pri_completo)
        self.assertIsInstance(p_completo, Proyecto)
        self.assertEqual(p_completo.nombre, nombre_completo)
        self.assertEqual(p_completo.descripcion, desc_completo)
        self.assertEqual(p_completo.fecha_limite, fl_completo)
        self.assertEqual(p_completo.prioridad, pri_completo)

    def test_funcion_agregar_tarea_a_proyecto(self):
        """Prueba la función agregar_tarea_a_proyecto."""
        proyecto = crear_proyecto("Proyecto para Tareas")

        nombre_tarea = "Tarea de Prueba Funcional"
        desc_tarea = "Descripción de la tarea de prueba"
        fl_tarea = datetime(2024, 10, 10)
        pri_tarea = "alta"

        tarea_agregada = agregar_tarea_a_proyecto(proyecto, nombre_tarea, descripcion_tarea=desc_tarea, fecha_limite_tarea=fl_tarea, prioridad_tarea=pri_tarea)

        self.assertIsInstance(tarea_agregada, Tarea)
        self.assertIn(tarea_agregada, proyecto.tareas)
        self.assertEqual(len(proyecto.tareas), 1)

        tarea_en_proyecto = proyecto.tareas[0]
        self.assertEqual(tarea_en_proyecto.nombre, nombre_tarea)
        self.assertEqual(tarea_en_proyecto.descripcion, desc_tarea)
        self.assertEqual(tarea_en_proyecto.fecha_limite, fl_tarea)
        self.assertEqual(tarea_en_proyecto.prioridad, pri_tarea)
        self.assertFalse(tarea_en_proyecto.completada)

    def test_funcion_agregar_tarea_a_proyecto_tipo_incorrecto(self):
        """Prueba que agregar_tarea_a_proyecto levante TypeError con un tipo de proyecto incorrecto."""
        with self.assertRaisesRegex(TypeError, "El primer argumento debe ser un objeto Proyecto."):
            agregar_tarea_a_proyecto("esto no es un proyecto", "Tarea inválida")

        with self.assertRaisesRegex(TypeError, "El primer argumento debe ser un objeto Proyecto."):
            agregar_tarea_a_proyecto(123, "Otra tarea inválida")

    def setUp(self):
        """
        Configuración inicial para cada método de prueba.
        Esto se ejecuta antes de cada test.
        """
        # Puedes inicializar objetos comunes aquí si es necesario para múltiples pruebas
        pass

if __name__ == '__main__':
    unittest.main()
