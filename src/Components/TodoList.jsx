import React, { useState, useEffect } from 'react';
import { BiCheckDouble, BiEdit, BiTrash, BiCheckCircle, BiReset, BiRefresh } from "react-icons/bi";
import './TodoList.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [displayMode, setDisplayMode] = useState('all');

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);
 
  const updateLocalStorage = (updatedTodos) => {
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };
 
  const addTodo = () => {
    if (inputValue.trim() !== '') {
      if (editIndex !== -1) {
        const updatedTodos = [...todos];
        updatedTodos[editIndex] = { task: inputValue, completed: updatedTodos[editIndex].completed };
        setTodos(updatedTodos);
        setInputValue('');
        setEditIndex(-1);
        updateLocalStorage(updatedTodos); // Update local storage
      } else {
        const newTodo = { task: inputValue, completed: false };
        setTodos([...todos, newTodo]);
        setInputValue('');
        updateLocalStorage([...todos, newTodo]); // Update local storage
      }
    }
  };

  const startEdit = (index) => {
    if (todos[index]) {
      setInputValue(todos[index].task);
      setEditIndex(index);
    }
  };

  const cancelEdit = () => {
    setInputValue('');
    setEditIndex(-1);
  };

  const removeTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    updateLocalStorage(updatedTodos)
  };

  const toggleCompleted = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
    updateLocalStorage(updatedTodos)
  };

  const handleTaskClick = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].expanded = !updatedTodos[index].expanded;
    setTodos(updatedTodos);
  };
  
  
  const handleDisplayAll = () => {
    setDisplayMode('all');
  };

  const handleDisplayCompleted = () => {
    setDisplayMode('completed');
  };

  const handleDisplayUncompleted = () => {
    setDisplayMode('uncompleted');
  };

  return (
    <div>
      <div className="todo-container">
        <h1>To-Do List</h1>
        <div className="input-section">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Enter a new task'
            className='input-field'
          />
          {editIndex !== -1 ? (
            <>
              <button onClick={addTodo} className="update-btn"><BiCheckDouble /></button>
              <button onClick={cancelEdit} className="cancel-btn"><BiRefresh /></button>
            </>
          ) : (
            <button onClick={addTodo} className="add-btn">Add</button>
          )}
        </div>
        <div className="filter-buttons">
          <button onClick={handleDisplayAll}>All</button>
          <button onClick={handleDisplayCompleted}>Completed</button>
          <button onClick={handleDisplayUncompleted}>Uncompleted</button>
        </div>
          <ul className='todo-list'>
            {todos.map((todo, index) => {
             const shouldDisplay =
              (displayMode === 'all') ||
              (displayMode === 'completed' && todo.completed) ||
              (displayMode === 'uncompleted' && !todo.completed);

            return (
              shouldDisplay && (
                <li key={index} className={todo.completed ? 'completed' : ''}>
                  <div
                    className={`task ${todo.expanded ? 'expanded' : ''}`}
                    onClick={() => handleTaskClick(index)}
                  >
                    {todo.expanded ? todo.task : (todo.task.length > 20 ? todo.task.slice(0, 20) + '...' : todo.task)}
                  </div>
                  <div className="btn-group">
                    <button onClick={() => startEdit(index)} className="btn-edit"><BiEdit /></button>
                    <button onClick={() => removeTodo(index)} className="btn-remove"><BiTrash /></button>
                    <button className="btn-done" onClick={() => toggleCompleted(index)}>
                      {todo.completed ? <BiReset /> : <BiCheckCircle />}
                    </button>
                  </div>
                </li>
              )
            );
          })}
        </ul>
      </div>
    </div>
  );
}
export default TodoList;