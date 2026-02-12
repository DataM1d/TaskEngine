import { useState, useEffect } from 'react';
import { todoService } from '../../services/todoService';
import { Category } from '../../types/todo';
import './CategoryManager.css';

const CategoryManager = ({ onClose }: { onClose: () => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await todoService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      await todoService.createCategory(newCatName);
      setNewCatName('');
      fetchCategories(); 
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this category? Tasks will remain but lose their tag.')) return;
    try {
      await todoService.deleteCategory(id);
      fetchCategories();
    } catch (err) {
      alert('Error deleting category');
    }
  };

  return (
    <div className="category-manager-overlay" onClick={onClose}>
      <div className="category-manager-glass" onClick={(e) => e.stopPropagation()}>
        <div className="manager-header">
          <h3>Manage Categories</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form className="category-input-group" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="New Category Name..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            autoFocus
          />
          <button type="submit" className="add-cat-btn">Add</button>
        </form>

        <div className="categories-list">
          {loading ? (
            <div className="loader">Loading...</div>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="category-row">
                <div className="cat-info">
                  <span className="cat-icon">{cat.icon || '📁'}</span>
                  <span className="cat-name">{cat.name}</span>
                </div>
                <button 
                  className="cat-delete-btn" 
                  onClick={() => handleDelete(cat.id)}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;