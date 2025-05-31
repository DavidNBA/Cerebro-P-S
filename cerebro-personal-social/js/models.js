// Data models (e.g., Proyecto, Tarea classes) will be defined here.

/**
 * Generates a simple unique ID.
 * Combines timestamp with a random string.
 * @returns {string} A unique ID string.
 */
function generarIdUnico() {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

/**
 * @class Tarea
 * @classdesc Represents a task with details and completion status.
 */
class Tarea {
    /**
     * Creates an instance of Tarea.
     * @param {string} nombre - The name of the task.
     * @param {string} [descripcion=''] - Optional description of the task.
     * @param {Date|null} [fechaLimite=null] - Optional due date for the task.
     * @param {string} [prioridad='media'] - Priority of the task ('alta', 'media', 'baja').
     */
    constructor(nombre, descripcion = '', fechaLimite = null, prioridad = 'media') {
        this.id = generarIdUnico();
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.completada = false;
        this.fechaCreacion = new Date();
        this.fechaLimite = fechaLimite instanceof Date || fechaLimite === null ? fechaLimite : new Date(fechaLimite);
        this.prioridad = prioridad; // 'alta', 'media', 'baja'
    }

    /**
     * Marks the task as completed.
     */
    marcarCompleta() {
        this.completada = true;
    }

    /**
     * Marks the task as pending.
     */
    marcarPendiente() {
        this.completada = false;
    }
}

/**
 * @class Proyecto
 * @classdesc Represents a project that can contain multiple tasks.
 */
class Proyecto {
    /**
     * Creates an instance of Proyecto.
     * @param {string} nombre - The name of the project.
     * @param {string} [descripcion=''] - Optional description of the project.
     * @param {Date|null} [fechaLimite=null] - Optional due date for the project.
     * @param {string} [prioridad='media'] - Priority of the project.
     */
    constructor(nombre, descripcion = '', fechaLimite = null, prioridad = 'media') {
        this.id = generarIdUnico();
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.tareas = []; // Array of Tarea objects
        this.fechaCreacion = new Date();
        this.fechaLimite = fechaLimite instanceof Date || fechaLimite === null ? fechaLimite : new Date(fechaLimite);
        this.prioridad = prioridad;
    }

    /**
     * Adds a Tarea instance to the project.
     * @param {Tarea} tarea - The Tarea object to add.
     * @throws {Error} If the provided argument is not an instance of Tarea.
     */
    agregarTarea(tarea) {
        if (!(tarea instanceof Tarea)) {
            throw new Error("El argumento debe ser una instancia de Tarea.");
        }
        this.tareas.push(tarea);
    }

    /**
     * Removes a task from the project by its ID.
     * @param {string} idTarea - The ID of the task to remove.
     * @returns {boolean} True if a task was removed, false otherwise.
     */
    eliminarTarea(idTarea) {
        const indiceTarea = this.tareas.findIndex(tarea => tarea.id === idTarea);
        if (indiceTarea > -1) {
            this.tareas.splice(indiceTarea, 1);
            return true;
        }
        return false;
    }

    /**
     * Calculates the completion progress of the project.
     * @type {number}
     * @readonly
     */
    get progreso() {
        if (this.tareas.length === 0) {
            return 0;
        }
        const tareasCompletadas = this.tareas.filter(t => t.completada).length;
        return (tareasCompletadas / this.tareas.length) * 100;
    }
}

console.log('models.js loaded');

// --- Example Usage (for testing in browser console) ---
/*
function probarModelos() {
    console.log("Probando modelos...");

    // Crear Tareas
    const tarea1 = new Tarea("Comprar leche", "Leche entera, 2 litros", new Date('2024-06-10'), "alta");
    const tarea2 = new Tarea("Pagar facturas", "Factura de luz y agua", new Date('2024-06-15'));
    const tarea3 = new Tarea("Llamar a Juan", "Confirmar reunión del viernes");

    console.log("Tarea 1:", tarea1);
    console.log("Tarea 2:", tarea2);
    console.log("Tarea 3:", tarea3);

    tarea1.marcarCompleta();
    console.log("Tarea 1 (completada):", tarea1.completada); // true
    tarea1.marcarPendiente();
    console.log("Tarea 1 (pendiente):", tarea1.completada); // false

    // Crear Proyecto
    const proyectoPrincipal = new Proyecto("Vacaciones de Verano", "Planificar viaje a la costa", new Date('2024-08-01'), "alta");
    console.log("Proyecto Principal:", proyectoPrincipal);

    // Agregar Tareas al Proyecto
    proyectoPrincipal.agregarTarea(tarea1);
    proyectoPrincipal.agregarTarea(tarea2);
    proyectoPrincipal.agregarTarea(tarea3);
    console.log("Tareas en Proyecto Principal:", proyectoPrincipal.tareas);
    console.log(`Progreso inicial del proyecto: ${proyectoPrincipal.progreso}%`); // 0%

    // Completar algunas tareas
    proyectoPrincipal.tareas[0].marcarCompleta(); // Tarea 1 completada
    console.log(`Progreso después de completar 1 tarea: ${proyectoPrincipal.progreso}%`); // ~33.33%

    proyectoPrincipal.tareas[1].marcarCompleta(); // Tarea 2 completada
    console.log(`Progreso después de completar 2 tareas: ${proyectoPrincipal.progreso}%`); // ~66.67%

    // Eliminar una tarea
    const idTareaAEliminar = tarea2.id;
    if (proyectoPrincipal.eliminarTarea(idTareaAEliminar)) {
        console.log(`Tarea con ID ${idTareaAEliminar} eliminada.`);
        console.log("Tareas restantes:", proyectoPrincipal.tareas);
    } else {
        console.log(`No se encontró tarea con ID ${idTareaAEliminar}.`);
    }
    console.log(`Progreso después de eliminar una tarea (y una completada de las restantes): ${proyectoPrincipal.progreso}%`); // 50% (tarea1 completada, tarea3 pendiente)

    // Intentar agregar algo que no es Tarea
    try {
        proyectoPrincipal.agregarTarea({ nombre: "Tarea inválida" });
    } catch (error) {
        console.error("Error esperado:", error.message); // "El argumento debe ser una instancia de Tarea."
    }

    // Proyecto sin tareas
    const proyectoVacio = new Proyecto("Proyecto Vacío");
    console.log(`Progreso proyecto vacío: ${proyectoVacio.progreso}%`); // 0%
}

// Para probar, abre la consola del navegador y ejecuta: probarModelos();
*/
