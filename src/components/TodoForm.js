import React, { useState } from 'react';

const TodoForm = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setAdding(true);
    try {
      await onAdd(text.trim());
      setText('');
    } catch {
      // error already shown by parent
    } finally {
      setAdding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        id="todo-input"
        type="text"
        className="todo-input"
        placeholder="What needs to be done?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={adding}
        autoComplete="off"
      />
      <button
        id="add-todo-btn"
        type="submit"
        className="btn-add"
        disabled={adding || !text.trim()}
      >
        {adding ? (
          <>
            <span className="loading-spinner" />
            Adding…
          </>
        ) : (
          '+ Add Task'
        )}
      </button>
    </form>
  );
};

export default TodoForm;
