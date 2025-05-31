// --- JSDoc Type Definitions (from src/models/types.ts) ---

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} nombre
 * @property {string} descripcion - Changed from optional to required for vanilla JS simplicity, can be empty string.
 * @property {'no iniciado' | 'en progreso' | 'completado'} estado
 * @property {string} [fechaInicio] - Optional
 * @property {string} [fechaFin] - Optional
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} nombre
 * @property {boolean} completada
 * @property {string} proyectoId
 */

/**
 * @typedef {Object} Contact
 * @property {string} id
 * @property {string} nombre
 * @property {string} [apellidos] - Optional
 * @property {string} [email] - Optional
 * @property {string} [telefono] - Optional
 */

/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} nombre
 * @property {string} [descripcion] - Optional
 * @property {string} fechaInicio
 * @property {string} [fechaFin] - Optional
 * @property {string} [ubicacion] - Optional
 */

/**
 * @typedef {Object} QuickNote
 * @property {string} id
 * @property {string} content
 * @property {string} createdAt
 */

// --- localStorage Keys ---
export const PROJECTS_KEY = 'projects';
export const TASKS_KEY = 'tasks';
export const CONTACTS_KEY = 'contacts';
export const EVENTS_KEY = 'events';
export const QUICKNOTES_KEY = 'quickNotes';

// --- Generic CRUD Functions ---

/**
 * Retrieves all items for a given key from localStorage.
 * @param {string} key The key in localStorage.
 * @returns {Array<Object>} An array of items, or an empty array if not found or error.
 */
export function getAllItems(key) {
  try {
    const itemsString = localStorage.getItem(key);
    if (!itemsString) {
      return [];
    }
    return JSON.parse(itemsString);
  } catch (error) {
    console.error(`Error getting items from localStorage for key "${key}":`, error);
    return [];
  }
}

/**
 * Retrieves a single item by its ID for a given key from localStorage.
 * Requires items in the array to have an 'id' property.
 * @param {string} key The key in localStorage.
 * @param {string} id The ID of the item to retrieve.
 * @returns {Object | null} The item if found, or null otherwise.
 */
export function getItemById(key, id) {
  try {
    const items = getAllItems(key);
    return items.find(item => item.id === id) || null;
  } catch (error) {
    console.error(`Error getting item by ID from localStorage for key "${key}", ID "${id}":`, error);
    return null;
  }
}

/**
 * Saves an item to localStorage. If an item with the same ID exists, it's updated.
 * Otherwise, a new item is added.
 * Requires items to have an 'id' property.
 * @param {string} key The key in localStorage.
 * @param {Object & {id: string}} item The item to save. Must have an 'id' property.
 */
export function saveItem(key, item) {
  try {
    const items = getAllItems(key);
    const existingItemIndex = items.findIndex(i => i.id === item.id);

    if (existingItemIndex > -1) {
      items[existingItemIndex] = item; // Update existing
    } else {
      items.push(item); // Add new
    }
    localStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error(`Error saving item to localStorage for key "${key}":`, error);
  }
}

/**
 * Deletes an item by its ID for a given key from localStorage.
 * @param {string} key The key in localStorage.
 * @param {string} id The ID of the item to delete.
 */
export function deleteItemById(key, id) {
  try {
    let items = getAllItems(key);
    items = items.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error(`Error deleting item by ID from localStorage for key "${key}", ID "${id}":`, error);
  }
}

// --- Specific Helper Functions ---

// Projects
/** @returns {Project[]} */
export function getProjects() {
  return getAllItems(PROJECTS_KEY);
}
/** @param {string} id @returns {Project | null} */
export function getProjectById(id) {
  return getItemById(PROJECTS_KEY, id);
}
/** @param {Project} project */
export function saveProject(project) {
  saveItem(PROJECTS_KEY, project);
}
/** @param {string} projectId */
export function deleteProject(projectId) {
  deleteItemById(PROJECTS_KEY, projectId);
  const tasks = getTasks().filter(task => task.proyectoId === projectId);
  tasks.forEach(task => deleteTask(task.id));
}

// Tasks
/** @returns {Task[]} */
export function getTasks() {
  return getAllItems(TASKS_KEY);
}
/** @param {string} id @returns {Task | null} */
export function getTaskById(id) {
  return getItemById(TASKS_KEY, id);
}
/** @param {Task} task */
export function saveTask(task) {
  saveItem(TASKS_KEY, task);
}
/** @param {string} taskId */
export function deleteTask(taskId) {
  deleteItemById(TASKS_KEY, taskId);
}
/** @param {string} projectId @returns {Task[]} */
export function getTasksByProjectId(projectId) {
  const allTasks = getTasks();
  return allTasks.filter(task => task.proyectoId === projectId);
}

// Contacts
/** @returns {Contact[]} */
export function getContacts() {
  return getAllItems(CONTACTS_KEY);
}
/** @param {string} id @returns {Contact | null} */
export function getContactById(id) {
  return getItemById(CONTACTS_KEY, id);
}
/** @param {Contact} contact */
export function saveContact(contact) {
  saveItem(CONTACTS_KEY, contact);
}
/** @param {string} contactId */
export function deleteContact(contactId) {
  deleteItemById(CONTACTS_KEY, contactId);
}

// Events
/** @returns {Event[]} */
export function getEvents() {
  return getAllItems(EVENTS_KEY);
}
/** @param {string} id @returns {Event | null} */
export function getEventById(id) {
  return getItemById(EVENTS_KEY, id);
}
/** @param {Event} event */
export function saveEvent(event) {
  saveItem(EVENTS_KEY, event);
}
/** @param {string} eventId */
export function deleteEvent(eventId) {
  deleteItemById(EVENTS_KEY, eventId);
}

// QuickNotes
/** @returns {QuickNote[]} */
export function getQuickNotes() {
  return getAllItems(QUICKNOTES_KEY);
}
/** @param {QuickNote} note */
export function saveQuickNote(note) {
  saveItem(QUICKNOTES_KEY, note);
}

console.log('VanillaJS storage module loaded.');
