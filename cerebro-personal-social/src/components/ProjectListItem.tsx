"use client";

import React from 'react';
import { Project } from '@/models/types';

interface ProjectListItemProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({ project, onEdit, onDelete }) => {
  const getStatusColor = (status: Project['estado']) => {
    switch (status) {
      case 'no iniciado':
        return 'bg-yellow-100 text-yellow-800';
      case 'en progreso':
        return 'bg-blue-100 text-blue-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <li className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex-grow mb-3 sm:mb-0">
        <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-1">{project.nombre}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          {/* Status pill styling might need more specific dark mode adjustments if current colors are not legible */}
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(project.estado)}`}>
            {project.estado.charAt(0).toUpperCase() + project.estado.slice(1)}
          </span>
        </p>
        {project.descripcion && <p className="text-gray-700 dark:text-gray-300 text-sm mb-1 line-clamp-2">{project.descripcion}</p>}
        {project.fechaInicio && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Inicio: {new Date(project.fechaInicio).toLocaleDateString()}
            {project.fechaFin && ` - Fin: ${new Date(project.fechaFin).toLocaleDateString()}`}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 flex space-x-2">
        <button
          onClick={() => onEdit(project)}
          className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(project.id)}
          className="px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
};

export default ProjectListItem;
