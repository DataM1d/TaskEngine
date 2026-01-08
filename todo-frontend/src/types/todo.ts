export type TodoStatus = 'active' | 'deleted';

export interface Category {
    id: string;
    name: string;
    created_at?: string;
}

export interface Todo {
    id: string;
    title: string;
    is_completed: boolean;
    is_recovered: boolean;
    category_id: string | null;
    status: TodoStatus;
    created_at: string;
    deleted_at: string | null;
    categories?: {
        name: string;
    };
}

export interface AICache {
    id: string;
    phrase: string;
    category: string;
    created_at: string;
}

export interface SidebarStats {
    total: number;
    active: number;
    completed: number;
    deleted: number;
    recovered: number;
    catCounts: Record<string, number>;
}

export type FilterType = 'All' | 'Trash' | 'Recovered' | string;