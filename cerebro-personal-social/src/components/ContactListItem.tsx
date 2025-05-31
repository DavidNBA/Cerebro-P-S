"use client";

import React from 'react';
import { Contact } from '@/models/types';

interface ContactListItemProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
}

const ContactListItem: React.FC<ContactListItemProps> = ({ contact, onEdit, onDelete }) => {
  return (
    <li className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex-grow mb-3 sm:mb-0">
          <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">
            {contact.nombre} {contact.apellidos}
          </h3>
          {contact.email && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <a href={`mailto:${contact.email}`} className="hover:text-indigo-500 dark:hover:text-indigo-300">
                {contact.email}
              </a>
            </p>
          )}
          {contact.telefono && <p className="text-sm text-gray-600 dark:text-gray-400">{contact.telefono}</p>}
        </div>
        <div className="flex-shrink-0 flex space-x-2">
          <button
            onClick={() => onEdit(contact)}
            className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(contact.id)}
            className="px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Eliminar
          </button>
        </div>
      </div>
    </li>
  );
};

export default ContactListItem;
