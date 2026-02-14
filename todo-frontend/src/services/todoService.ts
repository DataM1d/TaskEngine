import { supabase } from '../supabaseClient';
import { Todo, Category } from '../types/todo';
import { detectIconFromName } from '../utils/iconDetector';
import { detectCategoryFromTitle } from '../utils/itemTypeDetector';
import { formatCategoryName, TODO_SELECT_QUERY, mapCategoryData, mapTodoData } from '../utils/formatters';

export const todoService = {
  async getAll() {
    const { data, error } = await supabase
      .from('todos')
      .select(TODO_SELECT_QUERY)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: (data || []).map(mapTodoData)};
  },

  async getAllCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, icon, created_at')
      .order('name', { ascending: true });

    if (error) throw error;
    return { data: (data || []).map(mapCategoryData) };
  },

  async create(title: string, currentFilter: string = 'All') {
    const systemFilters = ['ALL', 'TRASH', 'RECYCLE BIN', 'NOTES'];
    const cleanFilter = currentFilter.toUpperCase().trim();

    const targetName = systemFilters.includes(cleanFilter) 
      ? detectCategoryFromTitle(title) 
      : currentFilter;

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
      .select(TODO_SELECT_QUERY)
      .single();

    if (error) throw error;

    if (cat && targetName.toUpperCase() !== 'PERSONAL') {
      this.learn(title, cat.name);
    }
    return { data: mapTodoData(data) };
  },

  async createCategory(name: string) {
    const categoryName = formatCategoryName(name);
    if (!categoryName) throw new Error('Category name cannot be empty');

    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: categoryName, icon: detectIconFromName(categoryName) }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('Category already exists');
      throw error;
    }
    return { data: data as Category };
  },

  async update(id: string, payload: Partial<Todo>) {
    const { data, error } = await supabase
      .from('todos')
      .update(payload)
      .eq('id', id)
      .select(TODO_SELECT_QUERY)
      .single();

    if (error) throw error;
    return { data: mapTodoData(data)};
  },

  async restore(id: string) {
    const { error } = await supabase
      .from('todos')
      .update({ status: 'active', is_recovered: true, deleted_at: null })
      .eq('id', id);
    if (error) throw error;
  },

  async updateDescription(id: string, description: string) {
    const { data, error } = await supabase
      .from('todos')
      .update({ description })
      .eq('id', id)
      .select(TODO_SELECT_QUERY)
      .single();

    if (error) throw error;
    return { data: mapTodoData(data) };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('todos')
      .update({ status: 'deleted', deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },

  async bulkUpdateCategory(todoIds: string[], categoryId: string) {
    if (!todoIds.length) return;
    const { error } = await supabase.from('todos').update({ category_id: categoryId }).in('id', todoIds);
    if (error) throw error;
  },

  async permanentlyDelete(id: string) {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) throw error;
  },

  async deleteAll() {
    const { error } = await supabase.from('todos').delete().eq('status', 'deleted');
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
}