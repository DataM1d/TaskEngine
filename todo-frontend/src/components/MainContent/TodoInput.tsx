import { useState, FormEvent, KeyboardEvent } from 'react';
import './TodoInput.css';

interface TodoInputProps {
  onAdd: (text: string) => void;
  isFlashActive?: boolean;
}

export default function TodoInput({ onAdd, isFlashActive }: TodoInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <form className='input-group' onSubmit={handleSubmit}>
      <input
        name='task'
        placeholder='What needs to be done?'
        required
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete='off'
        spellCheck='false'
        className='todo-input-field'
      />
      <button 
        type='submit' 
        className={`add-button ${isFlashActive ? 'flash-white' : ''}`}
      >
        Add Task
      </button>
    </form>
  );
}