import { Database, Board, List, Task } from './types';
import data from './data.json';

// In-memory database
let database: Database =
{
    boards: [],
    lists: [],
    tasks: [],
};

export const initializeDatabase = (): void =>
{
    database.boards = [...(data.boards as Board[])];
    database.lists = [...(data.lists as List[])];
    database.tasks = [...(data.tasks as Task[])];
};

export const getDatabase = (): Database => database;

export const resetDatabase = (): void =>
{
    initializeDatabase();
};

initializeDatabase();

export default database;
