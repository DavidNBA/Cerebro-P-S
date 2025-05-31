import {
  getAllItems,
  getItemById,
  saveItem,
  deleteItemById,
  getProjects,
  saveProject,
  deleteProject,
  getTasksByProjectId,
  PROJECTS_KEY, // Assuming PROJECTS_KEY is exported or known for testing
  TASKS_KEY // Assuming TASKS_KEY is exported or known for testing
} from './localStorage'; // Adjust path as necessary
import { Project, Task } from '../models/types'; // Adjust path as necessary

// Mock localStorage
let mockStore: { [key: string]: string } = {};

const localStorageMock = (() => {
  return {
    getItem: (key: string) => mockStore[key] || null,
    setItem: (key: string, value: string) => {
      mockStore[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete mockStore[key];
    },
    clear: () => {
      mockStore = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Example data
const project1: Project = { id: '1', nombre: 'Project Alpha', descripcion: 'First project', estado: 'en progreso' };
const project2: Project = { id: '2', nombre: 'Project Beta', descripcion: 'Second project', estado: 'no iniciado' };
const task1: Task = { id: 't1', nombre: 'Task 1 for Alpha', completada: false, proyectoId: '1' };
const task2: Task = { id: 't2', nombre: 'Task 2 for Alpha', completada: true, proyectoId: '1' };

describe('localStorage Generic Utilities', () => {
  beforeEach(() => {
    // Clear the mock store before each test
    localStorageMock.clear();
    // Spy on console.error to check for error logging if needed
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  // Test suite for getAllItems
  describe('getAllItems', () => {
    it('should return an empty array if localStorage is empty for the key', () => {
      expect(getAllItems<Project>('nonexistentkey')).toEqual([]);
    });

    it('should return all items for a given key', () => {
      const items = [project1, project2];
      localStorageMock.setItem(PROJECTS_KEY, JSON.stringify(items));
      expect(getAllItems<Project>(PROJECTS_KEY)).toEqual(items);
    });

    it('should return an empty array and log error if JSON parsing fails', () => {
      localStorageMock.setItem(PROJECTS_KEY, 'invalid json');
      expect(getAllItems<Project>(PROJECTS_KEY)).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  // Test suite for saveItem
  describe('saveItem', () => {
    it('should add a new item if it does not exist', () => {
      saveItem<Project>(PROJECTS_KEY, project1);
      const items = JSON.parse(localStorageMock.getItem(PROJECTS_KEY)!);
      expect(items).toEqual([project1]);
    });

    it('should update an existing item if ID matches', () => {
      localStorageMock.setItem(PROJECTS_KEY, JSON.stringify([project1]));
      const updatedProject1 = { ...project1, nombre: 'Project Alpha Updated' };
      saveItem<Project>(PROJECTS_KEY, updatedProject1);
      const items = JSON.parse(localStorageMock.getItem(PROJECTS_KEY)!);
      expect(items).toEqual([updatedProject1]);
    });

    it('should add to existing items without overwriting unrelated items', () => {
      localStorageMock.setItem(PROJECTS_KEY, JSON.stringify([project1]));
      saveItem<Project>(PROJECTS_KEY, project2);
      const items = JSON.parse(localStorageMock.getItem(PROJECTS_KEY)!);
      expect(items).toEqual([project1, project2]);
    });
  });

  // Test suite for getItemById
  describe('getItemById', () => {
    it('should return the correct item if ID exists', () => {
      localStorageMock.setItem(PROJECTS_KEY, JSON.stringify([project1, project2]));
      expect(getItemById<Project>(PROJECTS_KEY, '1')).toEqual(project1);
    });

    it('should return null if ID does not exist', () => {
      localStorageMock.setItem(PROJECTS_KEY, JSON.stringify([project1, project2]));
      expect(getItemById<Project>(PROJECTS_KEY, '3')).toBeNull();
    });

    it('should return null if key does not exist in localStorage', () => {
      expect(getItemById<Project>('nonexistentkey', '1')).toBeNull();
    });
  });

  // Test suite for deleteItemById
  describe('deleteItemById', () => {
    it('should delete an item if ID exists', () => {
      localStorageMock.setItem(PROJECTS_KEY, JSON.stringify([project1, project2]));
      deleteItemById(PROJECTS_KEY, '1');
      const items = JSON.parse(localStorageMock.getItem(PROJECTS_KEY)!);
      expect(items).toEqual([project2]);
    });

    it('should do nothing if ID does not exist', () => {
      localStorageMock.setItem(PROJECTS_KEY, JSON.stringify([project1, project2]));
      deleteItemById(PROJECTS_KEY, '3');
      const items = JSON.parse(localStorageMock.getItem(PROJECTS_KEY)!);
      expect(items).toEqual([project1, project2]);
    });
  });
});

describe('localStorage Specific Project Utilities', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('saveProject should save a project', () => {
    saveProject(project1);
    const projects = JSON.parse(localStorageMock.getItem(PROJECTS_KEY)!);
    expect(projects).toEqual([project1]);
  });

  it('getProjects should retrieve all projects', () => {
    localStorageMock.setItem(PROJECTS_KEY, JSON.stringify([project1, project2]));
    expect(getProjects()).toEqual([project1, project2]);
  });

  it('deleteProject should delete a project and its tasks', () => {
    // Setup: Save project1 and its tasks task1, task2. Save project2 as well.
    saveProject(project1);
    saveProject(project2);
    localStorageMock.setItem(TASKS_KEY, JSON.stringify([task1, task2]));

    deleteProject(project1.id); // Delete project1

    // Check that project1 is deleted
    const projects = getProjects();
    expect(projects).toEqual([project2]); // Only project2 should remain

    // Check that tasks associated with project1 are deleted
    const tasks = JSON.parse(localStorageMock.getItem(TASKS_KEY)!) as Task[];
    expect(tasks.find(task => task.proyectoId === project1.id)).toBeUndefined();
    expect(tasks.length).toBe(0); // Assuming only project1's tasks were there
  });
});

describe('localStorage Specific Task Utilities', () => {
    beforeEach(() => {
      localStorageMock.clear();
      // Setup some tasks and projects for context if needed by specific task functions
      localStorageMock.setItem(PROJECTS_KEY, JSON.stringify([project1, project2]));
      localStorageMock.setItem(TASKS_KEY, JSON.stringify([task1, task2]));
    });

    it('getTasksByProjectId should return only tasks for the given project ID', () => {
      const project1Tasks = getTasksByProjectId(project1.id);
      expect(project1Tasks).toEqual([task1, task2]);
      expect(project1Tasks.every(task => task.proyectoId === project1.id)).toBe(true);

      const project2Tasks = getTasksByProjectId(project2.id);
      expect(project2Tasks).toEqual([]); // No tasks for project2 in the initial mock data
    });
});

// Add more tests for Contact and Event specific functions if time/need permits
// For example:
// describe('localStorage Specific Contact Utilities', () => { ... });
// describe('localStorage Specific Event Utilities', () => { ... });

// Test for console error spy, just to ensure it was used correctly
// This isn't a real test of functionality but of the test setup
describe('Console error spy', () => {
    it('should have been called when JSON parsing failed', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.setItem('testkey_error', 'invalid json data');
      getAllItems('testkey_error');
      expect(console.error).toHaveBeenCalled();
      (console.error as jest.Mock).mockRestore();
    });
  });
