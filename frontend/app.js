document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todoForm');
    const todoInput = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const errorMessage = document.getElementById('errorMessage');

    let todos = [];
    let currentFilter = 'all';
    let searchQuery = '';

    // API Base URL (since frontend is served by the same backend, we can use relative path)
    const API_URL = '/api/todos';

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Show error message
    const showError = (message) => {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    };

    // Fetch all todos
    const fetchTodos = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch tasks.');
            todos = await response.json();
            renderTodos();
        } catch (error) {
            showError(error.message);
            todoList.innerHTML = '<li class="empty-state">Error loading tasks.</li>';
        }
    };

    // Add a new todo
    const addTodo = async (title) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            });
            if (!response.ok) throw new Error('Failed to add task.');
            const newTodo = await response.json();
            todos.unshift(newTodo); // Add to beginning of array
            renderTodos();
        } catch (error) {
            showError(error.message);
        }
    };

    // Toggle complete status
    const toggleComplete = async (id, currentStatus) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !currentStatus })
            });
            if (!response.ok) throw new Error('Failed to update task.');
            
            todos = todos.map(todo => 
                todo.id === id ? { ...todo, completed: !currentStatus } : todo
            );
            renderTodos();
        } catch (error) {
            showError(error.message);
        }
    };

    // Delete a todo
    const deleteTodo = async (id) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete task.');
            
            todos = todos.filter(todo => todo.id !== id);
            renderTodos();
        } catch (error) {
            showError(error.message);
        }
    };

    // Edit a todo title
    const updateTodoTitle = async (id, newTitle) => {
        if (!newTitle.trim()) return;
        
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle })
            });
            if (!response.ok) throw new Error('Failed to update task title.');
            
            todos = todos.map(todo => 
                todo.id === id ? { ...todo, title: newTitle } : todo
            );
            renderTodos();
        } catch (error) {
            showError(error.message);
        }
    };

    // Render logic
    const renderTodos = () => {
        todoList.innerHTML = '';

        let filteredTodos = todos.filter(todo => {
            // Apply filter
            if (currentFilter === 'pending' && todo.completed) return false;
            if (currentFilter === 'completed' && !todo.completed) return false;
            
            // Apply search
            if (searchQuery && !todo.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            
            return true;
        });

        if (filteredTodos.length === 0) {
            todoList.innerHTML = `<li class="empty-state">No tasks found.</li>`;
            return;
        }

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="todo-content">
                    <div class="checkbox" aria-label="Toggle completion"></div>
                    <div class="task-details">
                        <span class="task-title">${escapeHTML(todo.title)}</span>
                        <span class="task-date">Created on ${formatDate(todo.created_at)}</span>
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="action-btn edit-btn" aria-label="Edit task">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="action-btn delete-btn" aria-label="Delete task">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            `;

            // Event Listeners for actions
            const checkbox = li.querySelector('.checkbox');
            checkbox.addEventListener('click', () => toggleComplete(todo.id, todo.completed));

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

            const editBtn = li.querySelector('.edit-btn');
            const taskTitleSpan = li.querySelector('.task-title');
            
            editBtn.addEventListener('click', () => {
                const currentTitle = taskTitleSpan.textContent;
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'edit-input';
                input.value = currentTitle;
                
                taskTitleSpan.replaceWith(input);
                input.focus();
                
                const saveEdit = () => {
                    if (input.value !== currentTitle) {
                        updateTodoTitle(todo.id, input.value);
                    } else {
                        input.replaceWith(taskTitleSpan);
                    }
                };

                input.addEventListener('blur', saveEdit);
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') saveEdit();
                });
            });

            todoList.appendChild(li);
        });
    };

    // Helper to prevent XSS
    const escapeHTML = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    // Event Listeners for filters and search
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTodos();
        });
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderTodos();
    });

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = todoInput.value.trim();
        if (title) {
            addTodo(title);
            todoInput.value = '';
        }
    });

    // Initial load
    fetchTodos();
});
