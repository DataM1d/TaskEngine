import { useState, useEffect, useCallback } from 'react';
import { IoTrashOutline } from 'react-icons/io5';
import { useTodoContext } from '../../context/TodoContext';

export default function TrashActions() {
  const { deleteAllTrash, filteredTodos } = useTodoContext();
  const [confirmState, setConfirmState] = useState<'idle' | 'confirm' | 'deleting'>('idle');

  const handleEmpty = useCallback(async () => {
    if (confirmState === 'idle') {
      setConfirmState('confirm');
      return;
    }
    setConfirmState('deleting');
    try {
      await deleteAllTrash();
    } finally {
      setConfirmState('idle');
    }
  }, [confirmState, deleteAllTrash]);

  useEffect(() => {
    if (confirmState === 'confirm') {
      const timer = setTimeout(() => setConfirmState('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmState]);

  if (filteredTodos.length === 0) return null;

  return (
    <button
      className={`pro-delete-btn ${confirmState}`}
      disabled={confirmState === 'deleting'}
      onClick={handleEmpty}
      title={confirmState === 'confirm' ? 'Click again to confirm' : 'Empty Trash'}
    >
      {confirmState === 'deleting' ? <div className="btn-spinner" /> : <IoTrashOutline size={20} />}
    </button>
  );
}