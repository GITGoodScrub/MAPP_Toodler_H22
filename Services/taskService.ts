import database from './database';
import { Task } from './types';

export const getAllTasks = (): Task[] =>
{
    return database.tasks;
};

export const getTasksByListId = (listId: number): Task[] =>
{
    return database.tasks.filter(task => task.listId === listId);
};

export const getTaskById = (id: number): Task | undefined =>
{
    return database.tasks.find(task => task.id === id);
};

export const createTask = (
    name: string, 
    description: string, 
    listId: number, 
    isFinished: boolean = false
): Task =>
{
    const newTask: Task =
    {
        id: database.tasks.length > 0 
            ? Math.max(...database.tasks.map(t => t.id)) + 1 
            : 1,
        name,
        description,
        isFinished,
        listId,
    };
    
    database.tasks.push(newTask);
    return newTask;
};

export const updateTask = (id: number, updates: Partial<Task>): Task | null =>
{
    const index = database.tasks.findIndex(task => task.id === id);
    if (index !== -1)
    {
        database.tasks[index] = { ...database.tasks[index], ...updates };
        return database.tasks[index];
    }
    return null;
};

export const toggleTaskCompletion = (id: number): Task | null =>
{
    const task = database.tasks.find(task => task.id === id);
    if (task)
    {
        task.isFinished = !task.isFinished;
        return task;
    }
    return null;
};

export const moveTaskToDifferentList = (taskId: number, newListId: number): Task | null =>
{
    const task = database.tasks.find(task => task.id === taskId);
    if (task)
    {
        task.listId = newListId;
        return task;
    }
    return null;
};

export const deleteTask = (id: number): boolean =>
{
    const taskIndex = database.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return false;

    database.tasks.splice(taskIndex, 1);
    return true;
};
