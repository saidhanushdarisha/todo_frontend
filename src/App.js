import React, { useEffect, useState } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import SummaryButton from './components/SummaryButton';
import './App.css';

const backendURL = "https://todobackend-abab.onrender.com";

function App() {
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch(`${backendURL}/todos`);
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async (text) => {
    await fetch(`${backendURL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${backendURL}/todos/${id}`, { method: 'DELETE' });
    fetchTodos();
  };

  const toggleComplete = async (id) => {
    await fetch(`${backendURL}/todos/${id}/toggle`, { method: 'PATCH' });
    fetchTodos();
  };

  const updateTodo = async (id, newText) => {
    await fetch(`${backendURL}/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText })
    });
    fetchTodos();
  };

  const summarizeTodos = async () => {
    const res = await fetch(`${backendURL}/summarize`, { method: 'POST' });
    const data = await res.json();
    setMessage(data.message || data.summary || 'Summary sent!');
  };

  return (
    <div className="app-container">
      <h1>Todo Summary Assistant</h1>

      <TodoForm onAdd={addTodo} />

      <TodoList
        todos={todos}
        onDelete={deleteTodo}
        onToggle={toggleComplete}
        onUpdate={updateTodo}
      />

      <SummaryButton onClick={summarizeTodos} />

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
