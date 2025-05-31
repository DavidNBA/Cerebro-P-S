import {
    getProjects as getProjectsFromStorage,
    saveProject as saveProjectToStorage,
    deleteProject as deleteProjectFromStorage,
    getProjectById as getProjectByIdFromStorage,
    // PROJECTS_KEY // Not directly used here, but good to be aware of
} from './storage.js';
import { generateId } from '../utils/helpers.js';

/**
 * @typedef {import('./storage.js').Project} Project
 * @typedef {Omit<Project, 'id'>} ProjectData
 */

/**
 * Retrieves all projects.
 * @returns {Project[]} An array of projects.
 */
export function getAllProjects() {
    return getProjectsFromStorage();
}

/**
 * Adds a new project.
 * @param {ProjectData} projectData - The data for the new project.
 * @returns {Project} The newly created project.
 */
export function addProject(projectData) {
    if (!projectData.nombre) {
        throw new Error("Project name is required.");
    }
    const newProject = {
        ...projectData,
        id: generateId(),
        // Ensure default status if not provided, though form should handle it
        estado: projectData.estado || 'no iniciado',
        descripcion: projectData.descripcion || '', // Ensure description is at least an empty string
    };
    saveProjectToStorage(newProject);
    return newProject;
}

/**
 * Updates an existing project.
 * @param {string} projectId - The ID of the project to update.
 * @param {Partial<ProjectData>} updatedData - The data to update.
 * @returns {Project | null} The updated project, or null if not found.
 */
export function updateProject(projectId, updatedData) {
    const project = getProjectByIdFromStorage(projectId);
    if (!project) {
        console.error(`Project with ID ${projectId} not found for update.`);
        return null;
    }
    const updatedProject = { ...project, ...updatedData };
    saveProjectToStorage(updatedProject);
    return updatedProject;
}

/**
 * Deletes a project by its ID.
 * This also handles deleting associated tasks via storage.js logic.
 * @param {string} projectId - The ID of the project to delete.
 */
export function deleteProjectById(projectId) {
    deleteProjectFromStorage(projectId);
}

/**
 * Retrieves a single project by its ID.
 * @param {string} projectId - The ID of the project.
 * @returns {Project | null} The project, or null if not found.
 */
export function getProjectById(projectId) {
    return getProjectByIdFromStorage(projectId);
}

console.log('Project manager module loaded.');
