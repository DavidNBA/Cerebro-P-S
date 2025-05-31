import {
    getContacts as getContactsFromStorage,
    saveContact as saveContactToStorage,
    deleteContact as deleteContactFromStorage,
    getContactById as getContactByIdFromStorage,
    // CONTACTS_KEY // Not directly used here
} from './storage.js';
import { generateId } from '../utils/helpers.js';

/**
 * @typedef {import('./storage.js').Contact} Contact
 * @typedef {Omit<Contact, 'id'>} ContactData
 */

/**
 * Retrieves all contacts.
 * @returns {Contact[]} An array of contacts.
 */
export function getAllContacts() {
    return getContactsFromStorage();
}

/**
 * Adds a new contact.
 * @param {ContactData} contactData - The data for the new contact.
 * @returns {Contact} The newly created contact.
 */
export function addContact(contactData) {
    if (!contactData.nombre) {
        throw new Error("Contact name is required.");
    }
    const newContact = {
        ...contactData, // Includes nombre, and optional apellidos, email, telefono
        id: generateId(),
    };
    saveContactToStorage(newContact);
    return newContact;
}

/**
 * Updates an existing contact.
 * @param {string} contactId - The ID of the contact to update.
 * @param {Partial<ContactData>} updatedData - The data to update.
 * @returns {Contact | null} The updated contact, or null if not found.
 */
export function updateContact(contactId, updatedData) {
    const contact = getContactByIdFromStorage(contactId);
    if (!contact) {
        console.error(`Contact with ID ${contactId} not found for update.`);
        return null;
    }
    const updatedContact = { ...contact, ...updatedData };
    saveContactToStorage(updatedContact);
    return updatedContact;
}

/**
 * Deletes a contact by its ID.
 * @param {string} contactId - The ID of the contact to delete.
 */
export function deleteContactById(contactId) {
    deleteContactFromStorage(contactId);
}

/**
 * Retrieves a single contact by its ID.
 * @param {string} contactId - The ID of the contact.
 * @returns {Contact | null} The contact, or null if not found.
 */
export function getContactById(contactId) {
    return getContactByIdFromStorage(contactId);
}

console.log('Contact manager module loaded.');
