"use client";

import React, { useState, useEffect } from 'react';
import { Project } from '@/models/types';
import ProjectForm from '@/components/ProjectForm';
import ProjectListItem from '@/components/ProjectListItem';
import { getProjects, saveProject, deleteProject as deleteProjectFromStorage } from '@/lib/localStorage';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleAddProjectClick = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto y todas sus tareas asociadas?')) {
      deleteProjectFromStorage(projectId); // This also deletes associated tasks as per localStorage.ts
      setProjects(getProjects()); // Refresh list
    }
  };

  const handleFormSubmit = (projectData: Omit<Project, 'id'> | Project) => {
    let projectToSave: Project;
    if ('id' in projectData) { // Editing existing project
      projectToSave = projectData as Project;
    } else { // Creating new project
      projectToSave = {
        ...projectData,
        id: Date.now().toString(), // Simple ID generation
      };
    }
    saveProject(projectToSave);
    setProjects(getProjects()); // Refresh list
    setShowForm(false);
    setEditingProject(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Proyectos</h1>
        {!showForm && (
          <button
            onClick={handleAddProjectClick}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Añadir Nuevo Proyecto
          </button>
        )}
      </div>

      {showForm ? (
        <ProjectForm
          project={editingProject}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      ) : (
        <>
          {projects.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No hay proyectos aún. ¡Añade uno!</p>
          ) : (
            <ul className="space-y-4">
              {projects.map((project) => (
                <ProjectListItem
                  key={project.id}
                  project={project}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
