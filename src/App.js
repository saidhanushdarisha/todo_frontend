import React, { useEffect, useState } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import SummaryButton from './components/SummaryButton';
import './App.css';

// Use environment variable for backend URL (falls back to Render URL)
const backendURL =
  process.env.REACT_APP_BACKEND_URL || 'https://todo-backend-fgkh.onrender.com';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchTodos();
  }, []);

  // ── Helper: show timed message ──────────────────────────
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  // ── Fetch all todos ─────────────────────────────────────
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendURL}/todos`);
      if (!res.ok) throw new Error('Failed to fetch todos');
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      showMessage('⚠️ Could not load todos. Is the backend running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Add a new todo ──────────────────────────────────────
  const addTodo = async (text) => {
    try {
      const res = await fetch(`${backendURL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('Failed to add todo');
      const newTodo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      showMessage('❌ Failed to add todo.', 'error');
      throw err; // re-throw so form can reset loading state
    }
  };

  // ── Delete a todo ───────────────────────────────────────
  const deleteTodo = async (id) => {
    // Optimistic update
    setTodos((prev) => prev.filter((t) => t._id !== id));
    try {
      await fetch(`${backendURL}/todos/${id}`, { method: 'DELETE' });
    } catch (err) {
      showMessage('❌ Failed to delete todo.', 'error');
      fetchTodos(); // re-sync on error
    }
  };

  // ── Toggle complete/pending ─────────────────────────────
  const toggleComplete = async (id) => {
    try {
      const res = await fetch(`${backendURL}/todos/${id}/toggle`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      showMessage('❌ Failed to update todo.', 'error');
    }
  };

  // ── Update todo text ────────────────────────────────────
  const updateTodo = async (id, newText) => {
    try {
      const res = await fetch(`${backendURL}/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      showMessage('❌ Failed to update todo.', 'error');
    }
  };

  // ── Summarize & send to Slack ───────────────────────────
  const summarizeTodos = async () => {
    setSummarizing(true);
    try {
      const res = await fetch(`${backendURL}/summarize`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Failed');
      const preview = data.summary
        ? `"${data.summary.substring(0, 70).trim()}..."`
        : '';
      showMessage(`✅ Summary sent to Slack! ${preview}`, 'success');
    } catch (err) {
      showMessage(`❌ ${err.message}`, 'error');
    } finally {
      setSummarizing(false);
    }
  };

  // ── Stats ───────────────────────────────────────────────
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="app-wrapper">
      <div className="app-container">

        {/* Header */}
        <header className="app-header">
          <h1 className="app-title">✅ Todo Assistant</h1>
          <p className="app-subtitle">Stay organised · AI summaries · Send to Slack</p>
        </header>

        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-chip">
            <div className="stat-number">{total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-chip">
            <div className="stat-number">{pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-chip">
            <div className="stat-number">{completed}</div>
            <div className="stat-label">Done</div>
          </div>
        </div>

        {/* Add Todo Form */}
        <TodoForm onAdd={addTodo} />

        {/* Todo List */}
        <TodoList
          todos={todos}
          onDelete={deleteTodo}
          onToggle={toggleComplete}
          onUpdate={updateTodo}
          loading={loading}
        />

        {/* Summarize & Slack */}
        <div className="summary-section">
          <SummaryButton
            onClick={summarizeTodos}
            loading={summarizing}
            disabled={pending === 0}
          />
          {message.text && (
            <p className={`message ${message.type}`}>{message.text}</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
