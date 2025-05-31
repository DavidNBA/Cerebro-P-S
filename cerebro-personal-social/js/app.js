import {
    renderSidebar, renderPage,
    renderProjectList, renderProjectForm,
    renderContactList, renderContactForm,
    renderDashboard,
    renderQuickCaptureForm, // Added Quick Capture UI function
    createHTMLElement
} from './modules/ui.js';
import { loadTheme, initThemeSwitcher } from './modules/themeManager.js';
import * as projectManager from './modules/projectManager.js';
import * as contactManager from './modules/contactManager.js';
import { saveQuickNote } from './modules/storage.js'; // For Quick Capture
import { generateId } from './utils/helpers.js';   // For Quick Capture

console.log('CerebroApp Vanilla JS Initialized');

const appContentElement = document.getElementById('app-content');
const mainNavElement = document.getElementById('main-nav');

// --- Project Page Rendering Logic ---
let projectFormContainer = null; // To hold the project form when displayed

function showProjectForm(projectToEdit = null) {
    if (!projectFormContainer) {
        projectFormContainer = createHTMLElement('div', { id: 'project-form-container', class: 'my-4' });
    }
    projectFormContainer.innerHTML = ''; // Clear previous form

    const form = renderProjectForm(projectToEdit || {}, (formData) => {
        if (projectToEdit && projectToEdit.id) {
            projectManager.updateProject(projectToEdit.id, formData);
        } else {
            projectManager.addProject(formData);
        }
        renderProjectsPageContent(); // Re-render the list
        projectFormContainer.innerHTML = ''; // Hide form
    });
    projectFormContainer.appendChild(form);
    // Insert form container at the top of appContentElement or specific place
    if (appContentElement.firstChild) {
        appContentElement.insertBefore(projectFormContainer, appContentElement.firstChild);
    } else {
        appContentElement.appendChild(projectFormContainer);
    }
}

function renderProjectsPageContent() {
    // Ensure form container is removed if it exists outside the main rendering flow
    if (projectFormContainer && projectFormContainer.parentNode) {
        projectFormContainer.innerHTML = ''; // Clear it before potentially re-rendering list
    }

    const projects = projectManager.getAllProjects();
    const projectListElement = renderProjectList(
        projects,
        (projectId) => { // onEdit
            const project = projectManager.getProjectById(projectId);
            if (project) {
                showProjectForm(project);
            }
        },
        (projectId) => { // onDelete
            if (confirm('¿Estás seguro de que quieres eliminar este proyecto y sus tareas asociadas?')) {
                projectManager.deleteProjectById(projectId);
                renderProjectsPageContent(); // Re-render list
            }
        }
    );

    const pageContainer = createHTMLElement('div');
    const title = createHTMLElement('h2', { textContent: 'Proyectos' });
    const addButton = createHTMLElement('button', { class: 'button my-4', textContent: 'Añadir Nuevo Proyecto' });
    addButton.addEventListener('click', () => showProjectForm());

    pageContainer.appendChild(title);
    pageContainer.appendChild(addButton);
    // The projectFormContainer will be managed by showProjectForm, typically inserted before the list
    if (projectFormContainer && !projectFormContainer.firstChild) { // If form was hidden, ensure container is gone or ready
        // This logic might need refinement based on where form is shown
    }
    pageContainer.appendChild(projectListElement);

    renderPage('projects', pageContainer, appContentElement);
}

// --- Contact Page Rendering Logic ---
let contactFormContainer = null; // To hold the contact form when displayed

function showContactForm(contactToEdit = null) {
    if (!contactFormContainer) {
        contactFormContainer = createHTMLElement('div', { id: 'contact-form-container', class: 'my-4' });
    }
    contactFormContainer.innerHTML = ''; // Clear previous form

    const form = renderContactForm(contactToEdit || {}, (formData) => {
        if (contactToEdit && contactToEdit.id) {
            contactManager.updateContact(contactToEdit.id, formData);
        } else {
            contactManager.addContact(formData);
        }
        renderContactsPageContent(); // Re-render the list
        contactFormContainer.innerHTML = ''; // Hide form
    });
    contactFormContainer.appendChild(form);
    if (appContentElement.firstChild) {
        appContentElement.insertBefore(contactFormContainer, appContentElement.firstChild);
    } else {
        appContentElement.appendChild(contactFormContainer);
    }
}

function renderContactsPageContent() {
    if (contactFormContainer && contactFormContainer.parentNode) {
        contactFormContainer.innerHTML = '';
    }

    const contacts = contactManager.getAllContacts();
    const contactListElement = renderContactList(
        contacts,
        (contactId) => { // onEdit
            const contact = contactManager.getContactById(contactId);
            if (contact) {
                showContactForm(contact);
            }
        },
        (contactId) => { // onDelete
            if (confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
                contactManager.deleteContactById(contactId);
                renderContactsPageContent(); // Re-render list
            }
        }
    );

    const pageContainer = createHTMLElement('div');
    const title = createHTMLElement('h2', { textContent: 'Contactos' });
    const addButton = createHTMLElement('button', { class: 'button my-4', textContent: 'Añadir Nuevo Contacto' });
    addButton.addEventListener('click', () => showContactForm());

    pageContainer.appendChild(title);
    pageContainer.appendChild(addButton);
    pageContainer.appendChild(contactListElement);

    renderPage('contacts', pageContainer, appContentElement);
}


// --- Routes Configuration ---

function renderDashboardPageContent() {
    const projects = projectManager.getAllProjects();
    const contacts = contactManager.getAllContacts();

    const summaryData = {
        projectCount: projects.length,
        activeProjects: projects.filter(p => p.estado === 'en progreso').length,
        contactCount: contacts.length,
        // upcomingEvents: 0 // Placeholder for future
    };

    const dashboardElement = renderDashboard(summaryData);
    const pageContainer = createHTMLElement('div', {}, [
        createHTMLElement('h2', { textContent: 'Dashboard Principal' }),
        dashboardElement
    ]);
    renderPage('dashboard', pageContainer, appContentElement);
}

const routesConfig = {
    '/': {
        id: 'dashboard',
        title: 'Dashboard',
        navText: 'Dashboard',
        render: renderDashboardPageContent
    },
    '/projects': {
        id: 'projects',
        title: 'Projects',
        navText: 'Proyectos',
        render: renderProjectsPageContent
    },
    '/contacts': {
        id: 'contacts',
        title: 'Contacts',
        navText: 'Contactos',
        render: renderContactsPageContent // Updated to use the new render function
    },
    '/events': {
        id: 'events',
        title: 'Events',
        navText: 'Eventos',
        render: () => {
            // Placeholder
            const eventsContent = createHTMLElement('div', {}, [
                createHTMLElement('h2', { textContent: 'Eventos' }),
                createHTMLElement('p', { textContent: 'Aquí podrás gestionar tus eventos.' })
            ]);
            renderPage('events', eventsContent, appContentElement);
        }
    },
};

function generateNavLinks() {
    return Object.keys(routesConfig).map(routeKey => ({
        href: `#${routeKey}`,
        text: routesConfig[routeKey].navText
    }));
}

function router() {
    const path = window.location.hash.substring(1) || '/';
    const route = routesConfig[path];

    if (route && route.render) {
        document.title = `CerebroApp - ${route.title}`;
        route.render(); // Call the render function for the route
    } else {
        document.title = 'CerebroApp - Not Found';
        if (appContentElement) {
            renderPage('not-found', '<h2>404 - Page Not Found</h2>', appContentElement);
        }
    }
    // Update active links in sidebar
    if (mainNavElement) {
        renderSidebar(generateNavLinks(), mainNavElement);
    }
}

function initializeApp() {
    if (!mainNavElement || !appContentElement) {
        console.error('Essential navigation or content elements not found.');
        return;
    }

    renderSidebar(generateNavLinks(), mainNavElement);
    loadTheme();

    const header = document.querySelector('header'); // This is our sidebar
    if (header) {
        // Theme Switcher
        let themeSwitcherButton = document.getElementById('theme-switcher-button');
        if (!themeSwitcherButton) {
            themeSwitcherButton = createHTMLElement('button', {
                id: 'theme-switcher-button',
                class: 'button theme-switcher mt-4 mb-2 w-full', // Added mt-4, mb-2, w-full for spacing
            });
             // Appending after nav, before potential other items, or just at the end of header.
            header.appendChild(themeSwitcherButton);
        }
        initThemeSwitcher('theme-switcher-button');

        // Quick Capture Form
        const quickCaptureFormElement = renderQuickCaptureForm((noteText) => {
            const newNote = {
                id: generateId(),
                content: noteText,
                createdAt: new Date().toISOString(),
            };
            saveQuickNote(newNote);
            alert('Nota rápida guardada!'); // Simple feedback
            // Optionally, could also render quick notes somewhere or clear a list
        });
        header.appendChild(quickCaptureFormElement); // Append QC form at the end of the sidebar
    }

    window.addEventListener('hashchange', router);
    router(); // Initial page load
}

window.addEventListener('load', initializeApp);
