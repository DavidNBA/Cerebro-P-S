document.addEventListener('DOMContentLoaded', () => {
    let proyectos = [];

    // Referencias a elementos del DOM
    const formNuevoProyecto = document.getElementById('form-nuevo-proyecto');
    const listaProyectosDiv = document.getElementById('lista-proyectos');

    const proyectoNombreInput = document.getElementById('proyecto-nombre');
    const proyectoDescripcionInput = document.getElementById('proyecto-descripcion');
    const proyectoFechaLimiteInput = document.getElementById('proyecto-fecha-limite');
    const proyectoPrioridadInput = document.getElementById('proyecto-prioridad');

    /**
     * Formatea una fecha para visualización.
     * @param {Date|string|null} fecha - La fecha a formatear.
     * @returns {string} Fecha formateada o 'N/A'.
     */
    function formatearFecha(fecha) {
        if (!fecha) return 'N/A';
        // Si fecha ya es un objeto Date, usarlo, sino, intentar crear uno.
        const dateObj = fecha instanceof Date ? fecha : new Date(fecha);
        if (isNaN(dateObj.getTime())) return 'Fecha inválida';
        return dateObj.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    /**
     * Guarda los proyectos en localStorage.
     */
    function guardarProyectos() {
        localStorage.setItem('proyectos', JSON.stringify(proyectos.map(p => {
            // Convertir instancias de clase a objetos planos para serialización correcta
            const proyectoPlano = {...p};
            proyectoPlano.tareas = p.tareas.map(t => ({...t}));
            // Convertir fechas a ISO strings
            proyectoPlano.fechaCreacion = p.fechaCreacion.toISOString();
            if (p.fechaLimite) proyectoPlano.fechaLimite = p.fechaLimite.toISOString();
            proyectoPlano.tareas = p.tareas.map(t => {
                const tareaPlana = {...t};
                tareaPlana.fechaCreacion = t.fechaCreacion.toISOString();
                if (t.fechaLimite) tareaPlana.fechaLimite = t.fechaLimite.toISOString();
                return tareaPlana;
            });
            return proyectoPlano;
        })));
    }

    /**
     * Carga los proyectos desde localStorage.
     */
    function cargarProyectos() {
        const proyectosGuardados = localStorage.getItem('proyectos');
        if (proyectosGuardados) {
            const proyectosPlanos = JSON.parse(proyectosGuardados);
            proyectos = proyectosPlanos.map(pp => {
                const proyecto = new Proyecto(pp.nombre, pp.descripcion, pp.fechaLimite ? new Date(pp.fechaLimite) : null, pp.prioridad);
                proyecto.id = pp.id;
                proyecto.fechaCreacion = new Date(pp.fechaCreacion);
                proyecto.tareas = pp.tareas.map(tp => {
                    const tarea = new Tarea(tp.nombre, tp.descripcion, tp.fechaLimite ? new Date(tp.fechaLimite) : null, tp.prioridad);
                    tarea.id = tp.id;
                    tarea.completada = tp.completada;
                    tarea.fechaCreacion = new Date(tp.fechaCreacion);
                    return tarea;
                });
                return proyecto;
            });
        }
    }

    /**
     * Renderiza todos los proyectos y sus tareas en el DOM.
     */
    function renderizarProyectos() {
        listaProyectosDiv.innerHTML = ''; // Limpiar vista actual

        if (proyectos.length === 0) {
            listaProyectosDiv.innerHTML = '<p>No hay proyectos aún. ¡Crea uno!</p>';
            return;
        }

        proyectos.forEach(proyecto => {
            const proyectoDiv = document.createElement('div');
            proyectoDiv.classList.add('proyecto');
            proyectoDiv.setAttribute('data-id-proyecto', proyecto.id);

            let prioridadClase = '';
            if (proyecto.prioridad === 'alta') prioridadClase = 'prioridad-alta';
            else if (proyecto.prioridad === 'media') prioridadClase = 'prioridad-media';
            else if (proyecto.prioridad === 'baja') prioridadClase = 'prioridad-baja';

            proyectoDiv.innerHTML = `
                <h3>${proyecto.nombre}</h3>
                <p><strong>Descripción:</strong> ${proyecto.descripcion || 'N/A'}</p>
                <p><strong>Fecha Límite:</strong> ${formatearFecha(proyecto.fechaLimite)}</p>
                <p><strong>Prioridad:</strong> <span class="${prioridadClase}">${proyecto.prioridad.charAt(0).toUpperCase() + proyecto.prioridad.slice(1)}</span></p>
                <p><strong>Progreso:</strong> ${proyecto.progreso.toFixed(2)}%</p>

                <h4>Tareas</h4>
                <ul class="lista-tareas" data-id-proyecto-tareas="${proyecto.id}">
                    ${proyecto.tareas.map(tarea => {
                        let tareaPrioridadClase = '';
                        if (tarea.prioridad === 'alta') tareaPrioridadClase = 'prioridad-alta';
                        else if (tarea.prioridad === 'media') tareaPrioridadClase = 'prioridad-media';
                        else if (tarea.prioridad === 'baja') tareaPrioridadClase = 'prioridad-baja';

                        return `
                        <li class="${tarea.completada ? 'completada' : ''}">
                            <input type="checkbox" class="tarea-checkbox" data-id-proyecto="${proyecto.id}" data-id-tarea="${tarea.id}" ${tarea.completada ? 'checked' : ''}>
                            <span>${tarea.nombre}</span>
                            <small class="tarea-detalles">
                                (Prioridad: <span class="${tareaPrioridadClase}">${tarea.prioridad}</span>,
                                Límite: ${formatearFecha(tarea.fechaLimite)})
                                ${tarea.descripcion ? `- ${tarea.descripcion}` : ''}
                            </small>
                            <button class="btn-eliminar-tarea" data-id-proyecto="${proyecto.id}" data-id-tarea="${tarea.id}">Eliminar</button>
                        </li>`;
                    }).join('') || '<li>No hay tareas asignadas.</li>'}
                </ul>

                <form class="form-nueva-tarea" data-id-proyecto="${proyecto.id}">
                    <h5>Añadir Nueva Tarea</h5>
                    <input type="hidden" name="id-proyecto-asociado" value="${proyecto.id}">
                    <div>
                        <label>Nombre Tarea:</label>
                        <input type="text" name="tarea-nombre" required>
                    </div>
                    <div>
                        <label>Descripción Tarea:</label>
                        <textarea name="tarea-descripcion"></textarea>
                    </div>
                    <div>
                        <label>Fecha Límite Tarea:</label>
                        <input type="date" name="tarea-fecha-limite">
                    </div>
                    <div>
                        <label>Prioridad Tarea:</label>
                        <select name="tarea-prioridad">
                            <option value="media">Media</option>
                            <option value="alta">Alta</option>
                            <option value="baja">Baja</option>
                        </select>
                    </div>
                    <button type="submit">Añadir Tarea</button>
                </form>
            `;
            listaProyectosDiv.appendChild(proyectoDiv);
        });
        guardarProyectos(); // Guardar después de cualquier cambio que afecte la visualización
    }

    /**
     * Maneja el envío del formulario para crear un nuevo proyecto.
     * @param {Event} event - El evento de envío del formulario.
     */
    function manejarSubmitNuevoProyecto(event) {
        event.preventDefault();

        const nombre = proyectoNombreInput.value.trim();
        const descripcion = proyectoDescripcionInput.value.trim();
        const fechaLimite = proyectoFechaLimiteInput.value ? new Date(proyectoFechaLimiteInput.value + 'T00:00:00') : null; // Asegurar que se toma la fecha localmente
        const prioridad = proyectoPrioridadInput.value;

        if (!nombre) {
            alert("El nombre del proyecto es obligatorio.");
            return;
        }

        const nuevoProyecto = new Proyecto(nombre, descripcion, fechaLimite, prioridad);
        proyectos.push(nuevoProyecto);

        renderizarProyectos();
        formNuevoProyecto.reset();
    }

    /**
     * Maneja el envío del formulario para añadir una nueva tarea a un proyecto.
     * @param {Event} event - El evento de envío del formulario.
     */
    function manejarSubmitNuevaTarea(event) {
        event.preventDefault();
        const form = event.target;
        const idProyecto = form.getAttribute('data-id-proyecto');
        const proyecto = proyectos.find(p => p.id === idProyecto);

        if (!proyecto) return;

        const nombreTarea = form.elements['tarea-nombre'].value.trim();
        const descripcionTarea = form.elements['tarea-descripcion'].value.trim();
        const fechaLimiteTarea = form.elements['tarea-fecha-limite'].value ? new Date(form.elements['tarea-fecha-limite'].value + 'T00:00:00') : null;
        const prioridadTarea = form.elements['tarea-prioridad'].value;

        if (!nombreTarea) {
            alert("El nombre de la tarea es obligatorio.");
            return;
        }

        const nuevaTarea = new Tarea(nombreTarea, descripcionTarea, fechaLimiteTarea, prioridadTarea);
        proyecto.agregarTarea(nuevaTarea);

        renderizarProyectos();
        form.reset();
    }

    /**
     * Maneja el cambio de estado (completada/pendiente) de una tarea.
     * @param {Event} event - El evento de cambio del checkbox.
     */
    function manejarCambioEstadoTarea(event) {
        const checkbox = event.target;
        const idProyecto = checkbox.getAttribute('data-id-proyecto');
        const idTarea = checkbox.getAttribute('data-id-tarea');

        const proyecto = proyectos.find(p => p.id === idProyecto);
        if (!proyecto) return;

        const tarea = proyecto.tareas.find(t => t.id === idTarea);
        if (!tarea) return;

        if (checkbox.checked) {
            tarea.marcarCompleta();
        } else {
            tarea.marcarPendiente();
        }
        renderizarProyectos(); // Re-renderizar para actualizar progreso y estilos
    }

    /**
     * Maneja la eliminación de una tarea.
     * @param {string} idProyecto - ID del proyecto al que pertenece la tarea.
     * @param {string} idTarea - ID de la tarea a eliminar.
     */
    function manejarEliminarTarea(idProyecto, idTarea) {
        const proyecto = proyectos.find(p => p.id === idProyecto);
        if (!proyecto) return;

        const tareaEliminada = proyecto.eliminarTarea(idTarea);
        if (tareaEliminada) {
            renderizarProyectos();
        }
    }

    // --- Event Listeners ---
    formNuevoProyecto.addEventListener('submit', manejarSubmitNuevoProyecto);

    // Delegación de eventos para elementos dinámicos (formularios de tareas, checkboxes, botones de eliminar)
    listaProyectosDiv.addEventListener('submit', function(event) {
        if (event.target.classList.contains('form-nueva-tarea')) {
            manejarSubmitNuevaTarea(event);
        }
    });

    listaProyectosDiv.addEventListener('change', function(event) {
        if (event.target.classList.contains('tarea-checkbox')) {
            manejarCambioEstadoTarea(event);
        }
    });

    listaProyectosDiv.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn-eliminar-tarea')) {
            event.preventDefault();
            const idProyecto = event.target.getAttribute('data-id-proyecto');
            const idTarea = event.target.getAttribute('data-id-tarea');
            if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
                manejarEliminarTarea(idProyecto, idTarea);
            }
        }
    });


    // --- Inicialización ---
    cargarProyectos(); // Cargar proyectos desde localStorage al inicio
    renderizarProyectos(); // Renderizar los proyectos cargados o la lista vacía
});

// Pequeño estilo para tareas completadas (se podría mover a style.css pero es más dinámico aquí)
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = ".lista-tareas li.completada span { text-decoration: line-through; color: #6c757d; }";
document.head.appendChild(styleSheet);
