import uuid
from datetime import datetime

class Tarea:
    def __init__(self, nombre, descripcion=None, fecha_limite=None, prioridad='media'):
        self.id = uuid.uuid4()
        self.nombre = nombre
        self.descripcion = descripcion
        self.completada = False
        self.fecha_creacion = datetime.now()
        self.fecha_limite = fecha_limite
        self.prioridad = prioridad

    def __str__(self):
        return f"Tarea(id={self.id}, nombre='{self.nombre}', completada={self.completada})"

class Proyecto:
    def __init__(self, nombre, descripcion=None, fecha_limite=None, prioridad='media'):
        self.id = uuid.uuid4()
        self.nombre = nombre
        self.descripcion = descripcion
        self.tareas = []
        self.fecha_creacion = datetime.now()
        self.fecha_limite = fecha_limite
        self.prioridad = prioridad

    @property
    def progreso(self):
        if not self.tareas:
            return 0.0
        tareas_completadas = sum(1 for tarea in self.tareas if tarea.completada)
        return (tareas_completadas / len(self.tareas)) * 100

    def __str__(self):
        return f"Proyecto(id={self.id}, nombre='{self.nombre}', progreso={self.progreso:.2f}%)"

    def mostrar_progreso(self):
        """
        Imprime en la consola los detalles del proyecto, incluyendo el progreso de las tareas.
        """
        print("-" * 40)
        print(f"Proyecto: {self.nombre}")
        if self.descripcion:
            print(f"Descripción: {self.descripcion}")
        if self.fecha_limite:
            print(f"Fecha Límite: {self.fecha_limite.strftime('%Y-%m-%d %H:%M')}")
        print(f"Prioridad: {self.prioridad}")
        print(f"Progreso: {self.progreso:.2f}%")

        print("\nLista de Tareas:")
        if not self.tareas:
            print("  No hay tareas asignadas a este proyecto.")
        else:
            for tarea in self.tareas:
                estado = "Completada" if tarea.completada else "Pendiente"
                detalle_tarea = f"  - {tarea.nombre} (Estado: {estado}, Prioridad: {tarea.prioridad}"
                if tarea.fecha_limite:
                    detalle_tarea += f", Límite: {tarea.fecha_limite.strftime('%Y-%m-%d %H:%M')}"
                detalle_tarea += ")"
                print(detalle_tarea)
        print("-" * 40)

def crear_proyecto(nombre, descripcion=None, fecha_limite=None, prioridad='media'):
    """
    Crea y devuelve un nuevo objeto Proyecto.
    """
    return Proyecto(nombre, descripcion, fecha_limite, prioridad)

def agregar_tarea_a_proyecto(proyecto, nombre_tarea, descripcion_tarea=None, fecha_limite_tarea=None, prioridad_tarea='media'):
    """
    Crea una tarea y la añade a la lista de tareas del proyecto.
    """
    if not isinstance(proyecto, Proyecto):
        raise TypeError("El primer argumento debe ser un objeto Proyecto.")

    tarea = Tarea(nombre_tarea, descripcion_tarea, fecha_limite_tarea, prioridad_tarea)
    proyecto.tareas.append(tarea)
    return tarea

if __name__ == '__main__':
    # Ejemplo de uso
    proyecto_principal = crear_proyecto(
        "Organizar mudanza",
        "Planificar y ejecutar todos los pasos para la mudanza.",
        fecha_limite=datetime(2024, 12, 31, 18, 0, 0) # Ejemplo de fecha límite
    )

    tarea1 = agregar_tarea_a_proyecto(
        proyecto_principal,
        "Contratar empresa de mudanzas",
        prioridad_tarea='alta',
        fecha_limite_tarea=datetime(2024, 11, 30) # Ejemplo de fecha límite para tarea
    )
    tarea2 = agregar_tarea_a_proyecto(proyecto_principal, "Empacar cajas de la cocina")
    tarea3 = agregar_tarea_a_proyecto(
        proyecto_principal,
        "Notificar cambio de dirección",
        descripcion_tarea="Informar a bancos, suscripciones, etc."
    )

    print("\n--- Demo mostrar_progreso (antes de completar tareas) ---")
    proyecto_principal.mostrar_progreso()

    # Simular completar una tarea
    if proyecto_principal.tareas:
        proyecto_principal.tareas[0].completada = True

    print("\n--- Demo mostrar_progreso (después de completar una tarea) ---")
    proyecto_principal.mostrar_progreso()

    # Simular completar todas las tareas
    for tarea_item in proyecto_principal.tareas:
        tarea_item.completada = True

    print("\n--- Demo mostrar_progreso (después de completar todas las tareas) ---")
    proyecto_principal.mostrar_progreso()

    # Crear un proyecto sin tareas para probar el progreso y mostrar_progreso
    proyecto_vacio = crear_proyecto("Proyecto de prueba sin tareas", descripcion="Un proyecto para demostración")
    print("\n--- Demo mostrar_progreso (proyecto sin tareas) ---")
    proyecto_vacio.mostrar_progreso()

    # Probar validación de tipo en agregar_tarea_a_proyecto
    print("\n--- Prueba de error esperado ---")
    try:
        agregar_tarea_a_proyecto("no es un proyecto", "tarea invalida")
    except TypeError as e:
        print(f"Error esperado y capturado: {e}")
