import { supabase } from '../supabaseClient';
import { Todo, Category } from '../types/todo';
import { detectIconFromName } from '../utils/iconDetector';
import { detectCategoryFromTitle } from '../utils/itemTypeDetector';

const formatName = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};


export const todoService = {


  async getAll() {
    const { data, error } = await supabase
      .from('todos')
      .select(`
                id, 
                title, 
                description,
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

  async getAllCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, icon, created_at')
      .order('name', { ascending: true });

    if (error) throw error;

    return { 
      data: (data as Category[]).map(cat => ({
        ...cat,
        name: formatName(cat.name),
        icon: cat.icon || detectIconFromName(cat.name)
      })) 
    };
  },


  async create(title: string, currentFilter: string = 'All') {
    const systemFilters = ['ALL', 'TRASH', 'RECYCLE BIN', 'NOTES'];
    let targetName = '';

    const cleanFilter = currentFilter.toUpperCase().trim();

    if (systemFilters.includes(cleanFilter)) {
      targetName = detectCategoryFromTitle(title);
    } else {
      targetName = currentFilter; 
    }

    const { data: cat } = await supabase
      .from('categories')
      .select('id, name')
      .ilike('name', targetName)
      .maybeSingle();

    const { data, error } = await supabase
      .from('todos')
      .insert([{
        title,
        is_completed: false,
        status: 'active',
        is_recovered: false,
        category_id: cat?.id || null, 
      }])
      .select(`*, categories(name)`)
      .single();

    if (error) throw error;

    if (cat && targetName.toUpperCase() !== 'PERSONAL') {
      this.learn(title, cat.name);
    }
    return { data: data as unknown as Todo };
  },

  async createCategory(name: string) {
    const categoryName = formatName(name);
    
    if (!categoryName) throw new Error('Category name cannot be empty');

    const icon = detectIconFromName(categoryName);

    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: categoryName, icon }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('Category already exists');
      throw error;
    }
    return { data: data as unknown as Category };
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

  async updateDescription(id: string, description: string) {
    const { data, error } = await supabase
      .from('todos')
      .update({ description })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as unknown as Todo };
  },

  async bulkUpdateCategory(todoIds: string[], categoryId: string) {
    if (todoIds.length === 0) return;
    const { error } = await supabase
      .from('todos')
      .update({ category_id: categoryId })
      .in('id', todoIds);
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

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
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
  },


  async learn(title: string, categoryName: string) {
    const phrase = title.toLowerCase().trim();
    const target = categoryName.trim().toUpperCase(); 
    
    const systemFilters = ['ALL', 'TRASH', 'NOTES', 'RECYCLE BIN'];
    if (systemFilters.includes(target) || !phrase) return;

    await supabase.from('ai_cache').upsert(
      { phrase, category: target },
      { onConflict: 'phrase' }
    );
  }
};