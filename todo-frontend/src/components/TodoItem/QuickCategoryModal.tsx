import './QuickCategoryModal.css';

interface QuickCategoryModalProps {
  categoryName: string;
  isCreating: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function QuickCategoryModal({ categoryName, isCreating, error, onConfirm, onCancel }: QuickCategoryModalProps) {
  return (
    <div className="category-modal-overlay" onClick={onCancel}>
      <div className="category-modal manager-glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="category-modal-title">Create Category</h3>
          <button className="close-x" onClick={onCancel}>×</button>
        </div>
        <div className="modal-body">
          <p>Confirm making <strong>"{categoryName}"</strong> a permanent category?</p>
          {error && <div className="modal-error-badge">⚠️ {error}</div>}
        </div>
        <div className="category-modal-actions">
          <button className="category-modal-btn category-modal-btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="category-modal-btn category-modal-btn-create" onClick={onConfirm} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}