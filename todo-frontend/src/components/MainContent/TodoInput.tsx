import { useState, FormEvent } from 'react';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export default function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  };

  return (
    <form className='input-group' onSubmit={handleSubmit}>
      <input
      name='task'
      placeholder='What needs to be done?'
      required
      value={text}
      onChange={(e) => setText(e.target.value)}
      autoComplete='off'
      spellCheck='false'
      className='todo-input-field'
      />
      <button type='submit' className='add-button'>Add Task</button>
    </form>
  );
}