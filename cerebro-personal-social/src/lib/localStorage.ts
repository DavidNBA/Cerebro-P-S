import { Project, Task, Contact, Event, QuickNote } from '../models/types';

// --- Generic CRUD Functions ---

/**
 * Retrieves all items for a given key from localStorage.
 * @param key The key in localStorage.
 * @returns An array of items, or an empty array if not found or error.
 */
export function getAllItems<T>(key: string): T[] {
  try {
    const itemsString = localStorage.getItem(key);
    if (!itemsString) {
      return [];
    }
    return JSON.parse(itemsString) as T[];
  } catch (error) {
    console.error(`Error getting items from localStorage for key "${key}":`, error);
    return [];
  }
}

/**
 * Retrieves a single item by its ID for a given key from localStorage.
 * @param key The key in localStorage.
 * @param id The ID of the item to retrieve.
 * @returns The item if found, or null otherwise.
 */
export function getItemById<T extends { id: string }>(key: string, id: string): T | null {
  try {
    const items = getAllItems<T>(key);
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
 * @param key The key in localStorage.
 * @param item The item to save.
 */
export function saveItem<T extends { id: string }>(key: string, item: T): void {
  try {
    const items = getAllItems<T>(key);
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
 * @param key The key in localStorage.
 * @param id The ID of the item to delete.
 */
export function deleteItemById(key: string, id: string): void {
  try {
    let items = getAllItems<any>(key);
    items = items.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error(`Error deleting item by ID from localStorage for key "${key}", ID "${id}":`, error);
  }
}

// --- Specific Helper Functions ---

const PROJECTS_KEY = 'projects';
const TASKS_KEY = 'tasks';
const CONTACTS_KEY = 'contacts';
const EVENTS_KEY = 'events';

// Projects
export function getProjects(): Project[] {
  return getAllItems<Project>(PROJECTS_KEY);
}

export function getProjectById(id: string): Project | null {
  return getItemById<Project>(PROJECTS_KEY, id);
}

export function saveProject(project: Project): void {
  saveItem<Project>(PROJECTS_KEY, project);
}

export function deleteProject(projectId: string): void {
  deleteItemById(PROJECTS_KEY, projectId);
  // Optional: Also delete associated tasks
  const tasks = getTasks().filter(task => task.proyectoId === projectId);
  tasks.forEach(task => deleteTask(task.id));
}

// Tasks
export function getTasks(): Task[] {
  return getAllItems<Task>(TASKS_KEY);
}

export function getTaskById(id: string): Task | null {
  return getItemById<Task>(TASKS_KEY, id);
}

export function saveTask(task: Task): void {
  saveItem<Task>(TASKS_KEY, task);
}

export function deleteTask(taskId: string): void {
  deleteItemById(TASKS_KEY, taskId);
}

export function getTasksByProjectId(projectId: string): Task[] {
  const allTasks = getTasks();
  return allTasks.filter(task => task.proyectoId === projectId);
}

// Contacts
export function getContacts(): Contact[] {
  return getAllItems<Contact>(CONTACTS_KEY);
}

export function getContactById(id: string): Contact | null {
  return getItemById<Contact>(CONTACTS_KEY, id);
}

export function saveContact(contact: Contact): void {
  saveItem<Contact>(CONTACTS_KEY, contact);
}

export function deleteContact(contactId: string): void {
  deleteItemById(CONTACTS_KEY, contactId);
}

// Events
export function getEvents(): Event[] {
  return getAllItems<Event>(EVENTS_KEY);
}

export function getEventById(id: string): Event | null {
  return getItemById<Event>(EVENTS_KEY, id);
}

export function saveEvent(event: Event): void {
  saveItem<Event>(EVENTS_KEY, event);
}

export function deleteEvent(eventId: string): void {
  deleteItemById(EVENTS_KEY, eventId);
}

// --- QuickNote Specific Helper Functions ---

const QUICKNOTES_KEY = 'quickNotes';

export function getQuickNotes(): QuickNote[] {
  return getAllItems<QuickNote>(QUICKNOTES_KEY);
}

export function saveQuickNote(note: QuickNote): void {
  // Ensure notes are always added, not overwriting based on a shared ID if not careful.
  // The generic saveItem might try to update if an ID matched.
  // For quick notes, we typically always want to add.
  // However, if IDs are unique (e.g., timestamp), saveItem works fine.
  // Let's assume unique IDs for now.
  saveItem<QuickNote>(QUICKNOTES_KEY, note);
}
