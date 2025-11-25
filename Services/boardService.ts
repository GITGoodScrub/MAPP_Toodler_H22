import database from './database';
import { Board } from './types';

export const getAllBoards = (): Board[] =>
{
    return database.boards;
};

export const getBoardById = (id: number): Board | undefined =>
{
    return database.boards.find(board => board.id === id);
};

export const createBoard = (
    name: string, 
    description: string = '', 
    thumbnailPhoto: string
): Board =>
{
    const newBoard: Board =
    {
        id: database.boards.length > 0 
            ? Math.max(...database.boards.map(b => b.id)) + 1 
            : 1,
        name,
        description,
        thumbnailPhoto,
    };
    
    database.boards.push(newBoard);
    return newBoard;
};

export const updateBoard = (id: number, updates: Partial<Board>): Board | null =>
{
    const index = database.boards.findIndex(board => board.id === id);
    if (index !== -1)
    {
        database.boards[index] = { ...database.boards[index], ...updates };
        return database.boards[index];
    }
    return null;
};

// Delete a board (and all associated lists and tasks)
export const deleteBoard = (id: number): boolean =>
{
    const boardIndex = database.boards.findIndex(board => board.id === id);
    if (boardIndex === -1) return false;

    // Get all lists associated with this board
    const associatedLists = database.lists.filter(list => list.boardId === id);
    const listIds = associatedLists.map(list => list.id);

    // Delete all tasks associated with these lists
    database.tasks = database.tasks.filter(task => !listIds.includes(task.listId));

    // Delete all lists associated with this board
    database.lists = database.lists.filter(list => list.boardId !== id);

    // Delete the board
    database.boards.splice(boardIndex, 1);
    return true;
};
