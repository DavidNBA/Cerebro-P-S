"use client";

import React, { useState, useEffect } from 'react';
import { Contact } from '@/models/types';
import ContactForm from '@/components/ContactForm';
import ContactListItem from '@/components/ContactListItem';
import { getContacts, saveContact, deleteContact as deleteContactFromStorage } from '@/lib/localStorage';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  useEffect(() => {
    setContacts(getContacts());
  }, []);

  const handleAddContactClick = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleDeleteContact = (contactId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
      deleteContactFromStorage(contactId);
      setContacts(getContacts()); // Refresh list
    }
  };

  const handleFormSubmit = (contactData: Omit<Contact, 'id'> | Contact) => {
    let contactToSave: Contact;
    if ('id' in contactData) { // Editing existing contact
      contactToSave = contactData as Contact;
    } else { // Creating new contact
      contactToSave = {
        ...contactData,
        id: Date.now().toString(), // Simple ID generation
      };
    }
    saveContact(contactToSave);
    setContacts(getContacts()); // Refresh list
    setShowForm(false);
    setEditingContact(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Contactos</h1>
        {!showForm && (
          <button
            onClick={handleAddContactClick}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Añadir Nuevo Contacto
          </button>
        )}
      </div>

      {showForm ? (
        <ContactForm
          contact={editingContact}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      ) : (
        <>
          {contacts.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No hay contactos aún. ¡Añade uno!</p>
          ) : (
            <ul className="space-y-4">
              {contacts.map((contact) => (
                <ContactListItem
                  key={contact.id}
                  contact={contact}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
