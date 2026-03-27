import React, { useState } from 'react';

const TodoList = ({ todos, onDelete, onToggle, onUpdate, loading }) => {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    await onUpdate(id, editText.trim());
    cancelEdit();
  };

  // ── Loading State ────────────────────────────────────────
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner-large" />
        <p>Loading your todos…</p>
      </div>
    );
  }

  // ── Empty State ──────────────────────────────────────────
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <p>No todos yet — add one above!</p>
      </div>
    );
  }

  return (
    <ul className="todos-list">
      {todos.map((todo) => (
        <li key={todo._id}>
          <div className={`todo-card ${todo.completed ? 'completed' : ''}`}>

            {/* ── Main Row ── */}
            <div className="todo-main">

              {/* Circle Checkbox */}
              <div
                className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
                onClick={() => onToggle(todo._id)}
                title={todo.completed ? 'Mark as pending' : 'Mark as done'}
                role="checkbox"
                aria-checked={todo.completed}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onToggle(todo._id)}
              />

              {/* Text */}
              <span className="todo-text">{todo.text}</span>

              {/* Status Badge */}
              <span className={`badge ${todo.completed ? 'done' : 'pending'}`}>
                {todo.completed ? 'Done' : 'Pending'}
              </span>

              {/* Action Buttons */}
              <div className="todo-actions">
                {!todo.completed && editingId !== todo._id && (
                  <button
                    className="btn-icon edit"
                    onClick={() => startEdit(todo)}
                    title="Edit task"
                    aria-label="Edit"
                  >
                    ✏️
                  </button>
                )}
                <button
                  className="btn-icon delete"
                  onClick={() => onDelete(todo._id)}
                  title="Delete task"
                  aria-label="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* ── Inline Edit Area ── */}
            {editingId === todo._id && (
              <div className="todo-edit-area">
                <input
                  className="edit-input"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(todo._id);
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  autoFocus
                  placeholder="Update task…"
                />
                <button className="btn-save" onClick={() => saveEdit(todo._id)}>
                  Save
                </button>
                <button className="btn-cancel" onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            )}

          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
