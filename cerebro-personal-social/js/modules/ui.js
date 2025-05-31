/**
 * Helper function to create DOM elements.
 * @param {string} tag - The HTML tag name.
 * @param {Object} [attributes={}] - An object of attributes (e.g., { class: 'foo', id: 'bar' }).
 * @param {Array<HTMLElement|string|Node>} [children=[]] - An array of child elements or strings.
 * @returns {HTMLElement} The created HTML element.
 */
export function createHTMLElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    for (const key in attributes) {
        if (key === 'textContent') {
            element.textContent = attributes[key];
        } else if (key === 'innerHTML') {
            element.innerHTML = attributes[key];
        } else {
            element.setAttribute(key, attributes[key]);
        }
    }
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    });
    return element;
}

/**
 * Renders the sidebar navigation links.
 * @param {Array<{href: string, text: string}>} navLinks - Array of navigation link objects.
 * @param {HTMLElement} navElement - The <nav> element to render links into.
 */
export function renderSidebar(navLinks, navElement) {
    if (!navElement) {
        console.error('Navigation element not found for sidebar.');
        return;
    }
    navElement.innerHTML = ''; // Clear existing links
    const ul = createHTMLElement('ul');
    navLinks.forEach(linkInfo => {
        const a = createHTMLElement('a', { href: linkInfo.href, textContent: linkInfo.text });
        // Add active class logic if current hash matches link href
        if (window.location.hash === linkInfo.href || (window.location.hash === '' && linkInfo.href === '#/')) {
            a.classList.add('active');
        }
        const li = createHTMLElement('li', {}, [a]);
        ul.appendChild(li);
    });
    navElement.appendChild(ul);
}

/**
 * Clears the main content area and renders new content.
 * @param {string} pageId - The ID of the page (for potential future use, e.g. page-specific classes).
 * @param {string | HTMLElement | DocumentFragment} content - HTML string, a single HTMLElement, or a DocumentFragment to render.
 * @param {HTMLElement} appContentElement - The main content area element.
 */
export function renderPage(pageId, content, appContentElement) {
    if (!appContentElement) {
        console.error('App content element not found.');
        return;
    }
    // Clear previous content
    while (appContentElement.firstChild) {
        appContentElement.removeChild(appContentElement.firstChild);
    }

    // Add new content
    if (typeof content === 'string') {
        appContentElement.innerHTML = content; // Be cautious with HTML strings if they contain user input
    } else if (content instanceof Node) {
        appContentElement.appendChild(content);
    }

    // Update active link in sidebar
    const currentHash = window.location.hash || '#/';
    const navElement = document.getElementById('main-nav'); // Assuming this is where sidebar links are
    if (navElement) {
        navElement.querySelectorAll('a').forEach(a => {
            if (a.getAttribute('href') === currentHash) {
                a.classList.add('active');
            } else {
                a.classList.remove('active');
            }
        });
    }
}

// --- Project Specific UI Functions ---

/**
 * @typedef {import('./storage.js').Project} Project
 */

/**
 * Renders the list of projects.
 * @param {Project[]} projects - Array of project objects.
 * @param {(projectId: string) => void} onEdit - Callback function when edit button is clicked.
 * @param {(projectId: string) => void} onDelete - Callback function when delete button is clicked.
 * @returns {HTMLElement} The UL element containing the project list.
 */
export function renderProjectList(projects, onEdit, onDelete) {
    const ul = createHTMLElement('ul', { class: 'project-list space-y-4' }); // Added space-y-4 for spacing like in React version
    if (projects.length === 0) {
        const p = createHTMLElement('p', { textContent: 'No hay proyectos aún. ¡Añade uno!' });
        ul.appendChild(p); // Or return p directly if ul is not desired for empty state
        return ul;
    }

    projects.forEach(project => {
        const statusColors = {
            'no iniciado': 'bg-yellow-100 text-yellow-800',
            'en progreso': 'bg-blue-100 text-blue-800',
            'completado': 'bg-green-100 text-green-800',
        };
        const statusColor = statusColors[project.estado] || 'bg-gray-100 text-gray-800';

        const statusSpan = createHTMLElement('span', {
            class: `px-2 py-0.5 text-xs font-semibold rounded-full ${statusColor}`,
            textContent: project.estado.charAt(0).toUpperCase() + project.estado.slice(1)
        });

        let dateText = '';
        if (project.fechaInicio) {
            dateText = `Inicio: ${new Date(project.fechaInicio).toLocaleDateString()}`;
            if (project.fechaFin) {
                dateText += ` - Fin: ${new Date(project.fechaFin).toLocaleDateString()}`;
            }
        }

        const projectDetails = createHTMLElement('div', { class: 'flex-grow mb-3 sm:mb-0' }, [
            createHTMLElement('h3', { class: 'text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-1', textContent: project.nombre }),
            createHTMLElement('p', { class: 'text-sm text-gray-600 dark:text-gray-400 mb-1' }, [statusSpan]),
            project.descripcion ? createHTMLElement('p', { class: 'text-gray-700 dark:text-gray-300 text-sm mb-1 line-clamp-2', textContent: project.descripcion }) : '',
            dateText ? createHTMLElement('p', { class: 'text-xs text-gray-500 dark:text-gray-400', textContent: dateText}) : ''
        ].filter(Boolean)); // Filter out empty strings if description/date is not present

        const editButton = createHTMLElement('button', {
            class: 'button mr-2', // Using .button from styles.css
            textContent: 'Editar'
        });
        editButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent any parent click listeners
            onEdit(project.id);
        });

        const deleteButton = createHTMLElement('button', {
            class: 'button secondary', // Using .button.secondary
            textContent: 'Eliminar'
        });
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            onDelete(project.id);
        });

        const actionsDiv = createHTMLElement('div', { class: 'flex-shrink-0 flex space-x-2' }, [editButton, deleteButton]);

        const li = createHTMLElement('li', {
            class: 'card flex flex-col sm:flex-row justify-between items-start sm:items-center' // Using .card from styles.css
        }, [projectDetails, actionsDiv]);

        ul.appendChild(li);
    });
    return ul;
}

/**
 * Renders the project form.
 * @param {Project | {}} [project={}] - Optional project object for editing.
 * @param {(formData: Omit<Project, 'id'> | Project) => void} onSubmit - Callback for form submission.
 * @returns {HTMLFormElement} The form element.
 */
export function renderProjectForm(project = {}, onSubmit) {
    const form = createHTMLElement('form', { class: 'space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md card' }); // Added .card

    const createField = (labelText, inputType, id, value, options = {}) => {
        const label = createHTMLElement('label', { for: id, class: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1', textContent: labelText });
        let input;
        if (inputType === 'textarea') {
            input = createHTMLElement('textarea', { id, rows: 4, ...options });
            input.value = value;
        } else if (inputType === 'select') {
            input = createHTMLElement('select', { id, ...options });
            options.selectOptions.forEach(opt => {
                const optionEl = createHTMLElement('option', { value: opt.value, textContent: opt.text });
                if (opt.value === value) optionEl.selected = true;
                input.appendChild(optionEl);
            });
        } else {
            input = createHTMLElement('input', { type: inputType, id, value, ...options });
        }
        return createHTMLElement('div', {}, [label, input]);
    };

    form.appendChild(createField('Nombre del Proyecto', 'text', 'nombre', project.nombre || '', { required: true }));
    form.appendChild(createField('Descripción', 'textarea', 'descripcion', project.descripcion || '', { required: true }));
    form.appendChild(createField('Estado', 'select', 'estado', project.estado || 'no iniciado', {
        selectOptions: [
            { value: 'no iniciado', text: 'No Iniciado' },
            { value: 'en progreso', text: 'En Progreso' },
            { value: 'completado', text: 'Completado' },
        ]
    }));

    const dateFieldsContainer = createHTMLElement('div', { class: 'grid grid-cols-1 md:grid-cols-2 gap-6' });
    dateFieldsContainer.appendChild(createField('Fecha de Inicio', 'date', 'fechaInicio', project.fechaInicio || ''));
    dateFieldsContainer.appendChild(createField('Fecha de Fin', 'date', 'fechaFin', project.fechaFin || ''));
    form.appendChild(dateFieldsContainer);

    const submitButtonText = project.id ? 'Actualizar Proyecto' : 'Crear Proyecto';
    const submitButton = createHTMLElement('button', { type: 'submit', class: 'button', textContent: submitButtonText });
    // Add cancel button if needed, e.g., by passing an onCancel callback

    const buttonsDiv = createHTMLElement('div', { class: 'flex justify-end space-x-3' }, [submitButton]);
    form.appendChild(buttonsDiv);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            nombre: form.elements.nombre.value,
            descripcion: form.elements.descripcion.value,
            estado: form.elements.estado.value,
            fechaInicio: form.elements.fechaInicio.value || undefined,
            fechaFin: form.elements.fechaFin.value || undefined,
        };
        if (project.id) {
            onSubmit({ ...formData, id: project.id });
        } else {
            onSubmit(formData);
        }
    });

    return form;
}


console.log('UI module loaded with Project functions.');

// --- Contact Specific UI Functions ---

/**
 * @typedef {import('./storage.js').Contact} Contact
 */

/**
 * Renders the list of contacts.
 * @param {Contact[]} contacts - Array of contact objects.
 * @param {(contactId: string) => void} onEdit - Callback function when edit button is clicked.
 * @param {(contactId: string) => void} onDelete - Callback function when delete button is clicked.
 * @returns {HTMLElement} The UL element containing the contact list.
 */
export function renderContactList(contacts, onEdit, onDelete) {
    const ul = createHTMLElement('ul', { class: 'contact-list space-y-4' });
    if (contacts.length === 0) {
        ul.appendChild(createHTMLElement('p', { textContent: 'No hay contactos aún. ¡Añade uno!' }));
        return ul;
    }

    contacts.forEach(contact => {
        const contactName = `${contact.nombre} ${contact.apellidos || ''}`.trim();

        const contactDetails = createHTMLElement('div', { class: 'flex-grow mb-3 sm:mb-0' }, [
            createHTMLElement('h3', { class: 'text-xl font-semibold text-indigo-700 dark:text-indigo-400', textContent: contactName }),
            contact.email ? createHTMLElement('p', { class: 'text-sm text-gray-600 dark:text-gray-400' }, [
                createHTMLElement('a', { href: `mailto:${contact.email}`, class: 'hover:text-indigo-500 dark:hover:text-indigo-300', textContent: contact.email })
            ]) : '',
            contact.telefono ? createHTMLElement('p', { class: 'text-sm text-gray-600 dark:text-gray-400', textContent: contact.telefono }) : ''
        ].filter(Boolean));

        const editButton = createHTMLElement('button', { class: 'button mr-2', textContent: 'Editar' });
        editButton.addEventListener('click', (e) => { e.stopPropagation(); onEdit(contact.id); });

        const deleteButton = createHTMLElement('button', { class: 'button secondary', textContent: 'Eliminar' });
        deleteButton.addEventListener('click', (e) => { e.stopPropagation(); onDelete(contact.id); });

        const actionsDiv = createHTMLElement('div', { class: 'flex-shrink-0 flex space-x-2' }, [editButton, deleteButton]);

        const li = createHTMLElement('li', { class: 'card flex flex-col sm:flex-row justify-between items-start sm:items-center' }, [contactDetails, actionsDiv]);
        ul.appendChild(li);
    });
    return ul;
}

/**
 * Renders the contact form.
 * @param {Contact | {}} [contact={}] - Optional contact object for editing.
 * @param {(formData: Omit<Contact, 'id'> | Contact) => void} onSubmit - Callback for form submission.
 * @returns {HTMLFormElement} The form element.
 */
export function renderContactForm(contact = {}, onSubmit) {
    const form = createHTMLElement('form', { class: 'space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md card' });

    // Helper to create fields, similar to renderProjectForm
    const createField = (labelText, inputType, id, value, options = {}) => {
        const label = createHTMLElement('label', { for: id, class: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1', textContent: labelText });
        const input = createHTMLElement('input', { type: inputType, id, value, ...options });
        return createHTMLElement('div', {}, [label, input]);
    };

    const nameFieldsContainer = createHTMLElement('div', { class: 'grid grid-cols-1 md:grid-cols-2 gap-6' });
    nameFieldsContainer.appendChild(createField('Nombre', 'text', 'nombre', contact.nombre || '', { required: true }));
    nameFieldsContainer.appendChild(createField('Apellidos', 'text', 'apellidos', contact.apellidos || ''));
    form.appendChild(nameFieldsContainer);

    form.appendChild(createField('Email', 'email', 'email', contact.email || ''));
    form.appendChild(createField('Teléfono', 'tel', 'telefono', contact.telefono || ''));

    const submitButtonText = contact.id ? 'Actualizar Contacto' : 'Crear Contacto';
    const submitButton = createHTMLElement('button', { type: 'submit', class: 'button', textContent: submitButtonText });

    const buttonsDiv = createHTMLElement('div', { class: 'flex justify-end space-x-3' }, [submitButton]);
    form.appendChild(buttonsDiv);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            nombre: form.elements.nombre.value,
            apellidos: form.elements.apellidos.value || undefined,
            email: form.elements.email.value || undefined,
            telefono: form.elements.telefono.value || undefined,
        };
        if (contact.id) {
            onSubmit({ ...formData, id: contact.id });
        } else {
            onSubmit(formData);
        }
    });
    return form;
}

console.log('UI module updated with Contact functions.');

// --- Dashboard Specific UI Functions ---

/**
 * @typedef {Object} DashboardSummaryData
 * @property {number} projectCount
 * @property {number} activeProjects
 * @property {number} contactCount
 * // Add more summary data points as needed (e.g., upcomingEvents)
 */

/**
 * Renders the dashboard content.
 * @param {DashboardSummaryData} summaryData - Object containing summary data.
 * @returns {HTMLElement} The main div element for the dashboard.
 */
export function renderDashboard(summaryData) {
    const dashboardContainer = createHTMLElement('div', { class: 'dashboard-grid' }); // Using a specific class for grid layout

    // Project Summary Card
    const projectCard = createHTMLElement('div', { class: 'card' }, [
        createHTMLElement('h3', { class: 'text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-3', textContent: 'Proyectos' }),
        createHTMLElement('p', { class: 'text-gray-700 dark:text-gray-300 mb-1', textContent: `Total de Proyectos: ${summaryData.projectCount}` }),
        createHTMLElement('p', { class: 'text-gray-700 dark:text-gray-300 mb-4', textContent: `Proyectos Activos: ${summaryData.activeProjects}` }),
        createHTMLElement('a', { href: '#/projects', class: 'button', textContent: 'Gestionar Proyectos' })
    ]);
    dashboardContainer.appendChild(projectCard);

    // Contact Summary Card
    const contactCard = createHTMLElement('div', { class: 'card' }, [
        createHTMLElement('h3', { class: 'text-xl font-semibold text-teal-700 dark:text-teal-400 mb-3', textContent: 'Contactos' }),
        createHTMLElement('p', { class: 'text-gray-700 dark:text-gray-300 mb-4', textContent: `Total de Contactos: ${summaryData.contactCount}` }),
        createHTMLElement('a', { href: '#/contacts', class: 'button', textContent: 'Gestionar Contactos' })
    ]);
    dashboardContainer.appendChild(contactCard);

    // Placeholder for Event Summary Card (can be added similarly)
    // const eventCard = createHTMLElement('div', { class: 'card' }, [
    //     createHTMLElement('h3', { textContent: 'Eventos' }),
    //     createHTMLElement('p', { textContent: `Eventos Próximos: ${summaryData.upcomingEvents || 0}` }),
    //     createHTMLElement('a', { href: '#/events', class: 'button', textContent: 'Gestionar Eventos' })
    // ]);
    // dashboardContainer.appendChild(eventCard);

    return dashboardContainer;
}

// --- Quick Capture UI Function ---
/**
 * Renders the Quick Capture form.
 * @param {(noteText: string) => void} onSubmit - Callback function when "Save Note" is clicked.
 * @returns {HTMLDivElement} The div element containing the Quick Capture form.
 */
export function renderQuickCaptureForm(onSubmit) {
    const formContainer = createHTMLElement('div', { class: 'quick-capture-form p-4 border-t border-gray-700 dark:border-gray-600' });

    const title = createHTMLElement('h3', {
        textContent: 'Captura Rápida',
        class: 'text-lg font-semibold text-gray-200 dark:text-gray-300 mb-2' // Adjusted for sidebar dark theme
    });

    const textarea = createHTMLElement('textarea', {
        id: 'quick-capture-textarea', // Added ID for easier selection
        placeholder: 'Escribe una nota rápida...',
        rows: '3',
        class: 'w-full p-2 mb-2 text-sm text-gray-900 bg-gray-100 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-500 dark:placeholder-gray-400 rounded-md border border-gray-300' // Matched styles from React version
    });

    const saveButton = createHTMLElement('button', {
        textContent: 'Guardar Nota',
        class: 'button w-full' // Use existing .button style, make it full width
    });

    saveButton.addEventListener('click', () => {
        const noteText = textarea.value;
        if (noteText.trim() === '') {
            alert('El contenido de la nota no puede estar vacío.');
            return;
        }
        onSubmit(noteText);
        textarea.value = ''; // Clear textarea
    });

    formContainer.appendChild(title);
    formContainer.appendChild(textarea);
    formContainer.appendChild(saveButton);

    return formContainer;
}
