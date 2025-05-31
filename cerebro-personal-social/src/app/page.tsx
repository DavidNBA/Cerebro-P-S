"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Project, Contact } from '@/models/types';
import { getProjects } from '@/lib/localStorage';
import { getContacts } from '@/lib/localStorage';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    setProjects(getProjects());
    setContacts(getContacts());
  }, []);

  // Summaries will be calculated in the JSX
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.estado === 'en progreso').length;
  const totalContacts = contacts.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">Dashboard Principal</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Project Summary Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-3">Proyectos</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-1">
            Total de Proyectos: <span className="font-bold">{totalProjects}</span>
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Proyectos Activos: <span className="font-bold">{activeProjects}</span>
          </p>
          <Link href="/projects" className="inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
            Gestionar Proyectos
          </Link>
        </div>

        {/* Contact Summary Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-400 mb-3">Contactos</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Total de Contactos: <span className="font-bold">{totalContacts}</span>
          </p>
          <Link href="/contacts" className="inline-block px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200">
            Gestionar Contactos
          </Link>
        </div>

        {/* Placeholder for Future Event Summary Card
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-amber-700 mb-3">Eventos</h2>
          <p className="text-gray-700 mb-4">
            Próximos Eventos: <span className="font-bold">0</span>
          </p>
          <Link href="/events" className="inline-block px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200">
            Gestionar Eventos
          </Link>
        </div>
        */}
      </div>
    </div>
  );
}
