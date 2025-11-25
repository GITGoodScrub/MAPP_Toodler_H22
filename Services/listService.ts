import database from './database';
import { List } from './types';

export const getAllLists = (): List[] =>
{
    return database.lists;
};

export const getListsByBoardId = (boardId: number): List[] =>
{
    return database.lists.filter(list => list.boardId === boardId);
};

export const getListById = (id: number): List | undefined =>
{
    return database.lists.find(list => list.id === id);
};

export const createList = (
    name: string, 
    boardId: number, 
    color: string = '#ffffff'
): List =>
{
    const newList: List =
    {
        id: database.lists.length > 0 
            ? Math.max(...database.lists.map(l => l.id)) + 1 
            : 1,
        name,
        color,
        boardId,
    };
    
    database.lists.push(newList);
    return newList;
};

export const updateList = (id: number, updates: Partial<List>): List | null =>
{
    const index = database.lists.findIndex(list => list.id === id);
    if (index !== -1)
    {
        database.lists[index] = { ...database.lists[index], ...updates };
        return database.lists[index];
    }
    return null;
};

// Delete a list (and all associated tasks)
export const deleteList = (id: number): boolean =>
{
    const listIndex = database.lists.findIndex(list => list.id === id);
    if (listIndex === -1) return false;

    // Delete all tasks associated with this list
    database.tasks = database.tasks.filter(task => task.listId !== id);

    // Delete the list
    database.lists.splice(listIndex, 1);
    return true;
};
