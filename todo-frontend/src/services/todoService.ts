import { supabase } from '../supabaseClient';
import { Todo, Category } from '../types/todo';

const classifyWithMemory = async (title: string): Promise<string> => {
    const cleanTitle = title.toLowerCase().trim();
    if (!cleanTitle) return 'PERSONAL';
    
    try {
        const { data: remembered } = await supabase
            .from('ai_cache')
            .select('category')
            .eq('phrase', cleanTitle)
            .maybeSingle();
        if (remembered) return remembered.category;
    } catch (e) {
        console.error("Memory classification failed:", e);
    }

    const keywords = {
        URGENT: ['urgent', 'boss', 'asap', 'deadline', 'priority'],
        WORK: ['work', 'meeting', 'email', 'code', 'project', 'client']
    };

    if (keywords.URGENT.some(k => cleanTitle.includes(k))) return 'URGENT';
    if (keywords.WORK.some(k => cleanTitle.includes(k))) return 'WORK';
    
    return 'PERSONAL';
};

export const todoService = {
    async getAll() {
        const { data, error } = await supabase
            .from('todos')
            .select(`
                id, 
                title, 
                is_completed, 
                status, 
                is_recovered, 
                category_id, 
                created_at, 
                deleted_at, 
                categories (name)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data: data as unknown as Todo[] };
    },

    async create(title: string, categoryName: string = 'PERSONAL') {
        const systemFilters = ['ALL', 'ACTIVE', 'DONE', 'RECOVERED']; 
        let target = categoryName.toUpperCase().trim();
        
        if (systemFilters.includes(target)) {
            target = await classifyWithMemory(title);
        }

        const { data: cat } = await supabase
            .from('categories')
            .select('id')
            .eq('name', target)
            .maybeSingle();

        const finalCategoryId = cat?.id || '2ff23eda-d5d3-4af3-b975-285172b85172';

        const { data, error } = await supabase
            .from('todos')
            .insert([{ 
                title, 
                is_completed: false,
                status: 'active', 
                is_recovered: false,
                category_id: finalCategoryId
            }])
            .select(`id, title, is_completed, status, is_recovered, category_id, created_at, deleted_at, categories (name)`)
            .single();

        if (error) throw error;

        supabase.from('ai_cache').upsert(
            { phrase: title.toLowerCase().trim(), category: target },
            { onConflict: 'phrase' }
        ).then(); 

        return { data: data as unknown as Todo };
    },

    async update(id: string, payload: Partial<Todo>) {
        const { data, error } = await supabase
            .from('todos')
            .update(payload)
            .eq('id', id)
            .select(`id, title, is_completed, status, is_recovered, category_id, created_at, deleted_at, categories (name)`)
            .single();

        if (error) throw error;
        return { data: data as unknown as Todo };
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('todos')
            .update({
                status: 'deleted',
                deleted_at: new Date().toISOString()
            })
            .eq('id', id);
        if (error) throw error;
    },
    
    async restore(id: string) {
        const { error } = await supabase 
            .from('todos')
            .update({
                status: 'active',
                is_recovered: true, 
                deleted_at: null
            })
            .eq('id', id);
        if (error) throw error;
    },

    async permanentlyDelete(id: string) {
        const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    async deleteAll() {
        const { error } = await supabase
            .from('todos')
            .delete()
            .eq('status', 'deleted');
        if (error) throw error;
    }
};