import { Todo, Category } from '../types/todo';
import { detectIconFromName } from './iconDetector';

export const formatCategoryName = (name: string): string => {
    const trimmed = name.trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase() : '';
};

export const TODO_SELECT_QUERY = `
    id, title, description, is_completed, status, is_recovered, category_id, created_at, deleted_at, categories (name)
`;

export const mapTodoData = (item: any): Todo => {
    if (!item) return item;

    const categoryData = Array.isArray(item.categories)
       ? item.categories[0]
       : item.categories;

    return {
        ...item,
        categories: categoryData ? { name: categoryData.name } : undefined
    };
};

export const mapCategoryData = (cat: any): Category => ({
    ...cat,
    name: formatCategoryName(cat.name),
    icon: cat.icon || detectIconFromName(cat.name)
});


