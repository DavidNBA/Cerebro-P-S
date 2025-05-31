"use client";

import React, { useState, useEffect } from 'react';
import { Project } from '@/models/types';

interface ProjectFormProps {
  project?: Project | null; // For editing existing project
  onSubmit: (projectData: Omit<Project, 'id'> | Project) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onCancel }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState<'no iniciado' | 'en progreso' | 'completado'>('no iniciado');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    if (project) {
      setNombre(project.nombre);
      setDescripcion(project.descripcion);
      setEstado(project.estado);
      setFechaInicio(project.fechaInicio || '');
      setFechaFin(project.fechaFin || '');
    } else {
      // Reset form for new project
      setNombre('');
      setDescripcion('');
      setEstado('no iniciado');
      setFechaInicio('');
      setFechaFin('');
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      nombre,
      descripcion,
      estado,
      fechaInicio: fechaInicio || undefined, // Store as undefined if empty
      fechaFin: fechaFin || undefined, // Store as undefined if empty
    };

    if (project && project.id) {
      onSubmit({ ...projectData, id: project.id });
    } else {
      onSubmit(projectData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nombre del Proyecto
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
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descripción
        </label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={4}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="estado" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Estado
        </label>
        <select
          id="estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value as typeof estado)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {/* Note: <option> styling in dark mode is often browser-controlled */}
          <option value="no iniciado">No Iniciado</option>
          <option value="en progreso">En Progreso</option>
          <option value="completado">Completado</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha de Inicio
          </label>
          <input
            type="date"
            id="fechaInicio"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha de Fin
          </label>
          <input
            type="date"
            id="fechaFin"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
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
          {project ? 'Actualizar Proyecto' : 'Crear Proyecto'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
