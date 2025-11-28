export interface Board
{
    id: number;
    name: string;
    description: string;
    thumbnailPhoto: string;
}

export interface List
{
    id: number;
    name: string;
    color: string;
    boardId: number;
}

export interface Task
{
    id: number;
    name: string;
    description: string;
    isFinished: boolean;
    listId: number;
}

export interface Database
{
    boards: Board[];
    lists: List[];
    tasks: Task[];
}
