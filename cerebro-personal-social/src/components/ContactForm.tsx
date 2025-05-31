"use client";

import React, { useState, useEffect } from 'react';
import { Contact } from '@/models/types';

interface ContactFormProps {
  contact?: Contact | null; // For editing existing contact
  onSubmit: (contactData: Omit<Contact, 'id'> | Contact) => void;
  onCancel: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ contact, onSubmit, onCancel }) => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    if (contact) {
      setNombre(contact.nombre);
      setApellidos(contact.apellidos || '');
      setEmail(contact.email || '');
      setTelefono(contact.telefono || '');
    } else {
      // Reset form for new contact
      setNombre('');
      setApellidos('');
      setEmail('');
      setTelefono('');
    }
  }, [contact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contactData = {
      nombre,
      apellidos: apellidos || undefined,
      email: email || undefined,
      telefono: telefono || undefined,
    };

    if (contact && contact.id) {
      onSubmit({ ...contactData, id: contact.id });
    } else {
      onSubmit(contactData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Apellidos
          </label>
          <input
            type="text"
            id="apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Teléfono
        </label>
        <input
          type="tel"
          id="telefono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {contact ? 'Actualizar Contacto' : 'Crear Contacto'}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
