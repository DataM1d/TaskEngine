import React, { useState, useRef, useEffect } from 'react';
import { useTodoContext } from '../../context/TodoContext';
import CategoryIcon from '../ui/CategoryIcon';
import { detectIconFromName } from '../../utils/iconDetector';
import './CategoryManager.css'; 

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export default function CategoryModal({ onClose, isDarkMode }: CategoryModalProps) {
  const { categories, createCategory, deleteCategory } = useTodoContext();
  
  const [categoryName, setCategoryName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    return () => {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    };
  }, []);

  const handleCreate = async () => {
    if (!categoryName.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    setIsCreating(true);
    setError('');
    try {
      await createCategory(categoryName.trim());
      setCategoryName('');
      inputRef.current?.focus();
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = (id: string) => {
    if (deleteConfirmId === id) {
      deleteCategory(id);
      setDeleteConfirmId(null);
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    } else {
      setDeleteConfirmId(id);
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = setTimeout(() => setDeleteConfirmId(null), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="category-modal-overlay" onClick={onClose}>
      <div className="category-modal manager-glass" onClick={(e) => e.stopPropagation()}>
        
        <header className="modal-header">
          <h3 className="category-modal-title">Manage Categories</h3>
          <button className="close-x" onClick={onClose} aria-label="Close modal" />
        </header>

        <section className="modal-section">
          <div className="category-input-wrapper">
            <input 
              ref={inputRef}
              type="text"
              className="category-modal-input"
              placeholder="New category name..."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="add-inline-btn"
              onClick={handleCreate}
              disabled={isCreating || !categoryName.trim()}
            >
              {isCreating ? '...' : '+'}
            </button>
          </div>
          {error && <p className="category-modal-error">{error}</p>}
        </section>

        <div className="category-manager-list">
          {categories.map(cat => (
            <div key={cat.id} className="manager-row">
              <div className="manager-info">
                <span className="manager-icon">
                  <CategoryIcon iconName={detectIconFromName(cat.name, isDarkMode)} size={14} />
                </span>
                <span className="manager-name">{cat.name}</span>
              </div>
              <button 
                className={`manager-delete-btn ${deleteConfirmId === cat.id ? 'confirming' : ''}`}
                onClick={() => handleDelete(cat.id)}
                title={deleteConfirmId === cat.id ? "Click again to confirm" : "Delete category"}
              >
                {deleteConfirmId === cat.id ? 'confirm?' : '×'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}