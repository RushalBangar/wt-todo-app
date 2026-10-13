/**
 * ==============================================================================
 * TaskMaster - Simple Todo List Web App
 * Course Outcomes: CO1 (Frontend JS/jQuery/JSON), CO2 (Server-side CRUD Architecture)
 * 
 * Key Syllabus Features Demonstrated:
 * 1. JavaScript Objects: Creating structured task objects with properties.
 * 2. JavaScript Arrays: Storing and manipulating items in an array.
 * 3. JSON Handling: JSON.stringify() and JSON.parse() for serialization & persistence.
 * 4. jQuery Events: .on('click'), .on('submit'), .on('change'), .on('keyup').
 * 5. Servlet Integration: jQuery AJAX ($.ajax) communicating with TodoServlet (/api/todos).
 * ==============================================================================
 */

// 1. DATA MODEL (JavaScript Array & Objects)
let todoList = [];
let currentFilter = 'all';

// Servlet API Endpoint (Mapped in web.xml)
const SERVLET_API_URL = 'api/todos';

// Fallback LocalStorage Key (When running offline without Tomcat server)
const STORAGE_KEY = 'taskmaster_todos_json';
let isServerConnected = false;

// Initialize on DOM Ready
$(document).ready(function () {
    console.log("TaskMaster initialized with jQuery v" + $.fn.jquery);

    // Initial load: Fetch tasks from Servlet via jQuery AJAX
    fetchTodosFromServer();

    // ==========================================================================
    // 2. jQuery EVENT LISTENERS
    // ==========================================================================

    // Form Submit: Add New Task
    $('#todoForm').on('submit', function (event) {
        event.preventDefault();
        handleAddTask();
    });

    // Checkbox Toggle: Mark as Completed / Pending
    $(document).on('change', '.task-checkbox', function () {
        const taskId = Number($(this).closest('.todo-item').data('id'));
        toggleTaskStatus(taskId);
    });

    // Delete Task Button
    $(document).on('click', '.delete-btn', function () {
        const taskId = Number($(this).closest('.todo-item').data('id'));
        deleteTask(taskId);
    });

    // Inline Edit Task Button
    $(document).on('click', '.edit-btn', function () {
        const taskId = Number($(this).closest('.todo-item').data('id'));
        editTask(taskId);
    });

    // Filter Buttons (All / Pending / Completed)
    $('.filter-btn').on('click', function () {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        currentFilter = $(this).data('filter');
        renderTodoList();
    });

    // Search Box KeyUp
    $('#searchInput').on('keyup', function () {
        renderTodoList();
    });

    // Clear Completed Tasks
    $('#clearCompletedBtn').on('click', function () {
        clearCompletedTasks();
    });

    // Open JSON Viewer Modal
    $('#exportJsonBtn').on('click', function () {
        openJsonModal();
    });

    // Close JSON Viewer Modal
    $('#closeModalBtn, #jsonModal').on('click', function (e) {
        if (e.target === this) {
            $('#jsonModal').addClass('hidden');
        }
    });

    // Copy JSON to Clipboard
    $('#copyJsonBtn').on('click', function () {
        const jsonText = $('#jsonDisplay').text();
        navigator.clipboard.writeText(jsonText).then(function () {
            alert('JSON copied to clipboard!');
        });
    });

    // Download JSON File
    $('#downloadJsonBtn').on('click', function () {
        downloadJsonFile();
    });
});

// ==============================================================================
// 3. SERVLET AJAX INTEGRATION (jQuery $.ajax connecting to TodoServlet)
// ==============================================================================

/**
 * READ: Fetches todos from TodoServlet (doGet)
 * Demonstrates: jQuery $.ajax with JSON dataType
 */
function fetchTodosFromServer() {
    $.ajax({
        url: SERVLET_API_URL,
        type: 'GET',
        dataType: 'json',
        timeout: 2000,
        success: function (data) {
            console.log("Connected to TodoServlet. Data received:", data);
            isServerConnected = true;
            todoList = data;
            updateServerStatusBadge(true);
            renderTodoList();
        },
        error: function () {
            // When Tomcat is not running (e.g., opened via file://), use local persistence fallback
            console.warn("Servlet not reachable (running in local offline mode). Loading from local storage.");
            isServerConnected = false;
            updateServerStatusBadge(false);
            loadTodosFromStorage();
            renderTodoList();
        }
    });
}

/**
 * CREATE: Sends new task to TodoServlet (doPost action=create)
 */
function handleAddTask() {
    const inputField = $('#taskInput');
    const taskTitle = inputField.val().trim();
    const priority = $('#prioritySelect').val();

    if (taskTitle === "") {
        alert("Please enter a task description!");
        return;
    }

    // Creating JavaScript Object representing the task
    const newTask = {
        id: Date.now(),
        title: taskTitle,
        priority: priority,
        completed: false,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // If Tomcat server is active, persist via Servlet
    if (isServerConnected) {
        $.ajax({
            url: SERVLET_API_URL,
            type: 'POST',
            data: {
                action: 'create',
                title: taskTitle,
                priority: priority
            },
            dataType: 'json',
            success: function (updatedTodos) {
                todoList = updatedTodos;
                renderTodoList();
            },
            error: function () {
                // Local fallback
                todoList.push(newTask);
                saveTodosToStorage();
                renderTodoList();
            }
        });
    } else {
        // Offline / zero-download mode
        todoList.push(newTask);
        saveTodosToStorage();
        renderTodoList();
    }

    inputField.val('').focus();
}

/**
 * UPDATE: Toggles task status in TodoServlet (doPost action=toggle)
 */
function toggleTaskStatus(taskId) {
    const task = todoList.find(item => item.id === taskId);
    if (!task) return;

    if (isServerConnected) {
        $.ajax({
            url: SERVLET_API_URL,
            type: 'POST',
            data: {
                action: 'toggle',
                id: taskId
            },
            dataType: 'json',
            success: function (updatedTodos) {
                todoList = updatedTodos;
                renderTodoList();
            }
        });
    } else {
        task.completed = !task.completed;
        saveTodosToStorage();
        renderTodoList();
    }
}

/**
 * UPDATE: Edits task title
 */
function editTask(taskId) {
    const task = todoList.find(item => item.id === taskId);
    if (!task) return;

    const newTitle = prompt("Update your task title:", task.title);
    if (newTitle !== null && newTitle.trim() !== "") {
        task.title = newTitle.trim();
        saveTodosToStorage();
        renderTodoList();
    }
}

/**
 * DELETE: Removes task via TodoServlet (doPost action=delete)
 */
function deleteTask(taskId) {
    if (isServerConnected) {
        $.ajax({
            url: SERVLET_API_URL,
            type: 'POST',
            data: {
                action: 'delete',
                id: taskId
            },
            dataType: 'json',
            success: function (updatedTodos) {
                todoList = updatedTodos;
                renderTodoList();
            }
        });
    } else {
        todoList = todoList.filter(item => item.id !== taskId);
        saveTodosToStorage();
        renderTodoList();
    }
}

/**
 * DELETE BATCH: Clears completed tasks
 */
function clearCompletedTasks() {
    const completedCount = todoList.filter(t => t.completed).length;
    if (completedCount === 0) {
        alert("No completed tasks to clear.");
        return;
    }

    if (confirm(`Remove ${completedCount} completed task(s)?`)) {
        if (isServerConnected) {
            $.ajax({
                url: SERVLET_API_URL,
                type: 'POST',
                data: { action: 'clearCompleted' },
                dataType: 'json',
                success: function (updatedTodos) {
                    todoList = updatedTodos;
                    renderTodoList();
                }
            });
        } else {
            todoList = todoList.filter(item => !item.completed);
            saveTodosToStorage();
            renderTodoList();
        }
    }
}

// ==============================================================================
// 4. RENDERING & DOM UPDATES
// ==============================================================================

function renderTodoList() {
    const listContainer = $('#todoList');
    const searchTerm = $('#searchInput').val().toLowerCase();

    let filteredList = todoList.filter(task => {
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    if (searchTerm) {
        filteredList = filteredList.filter(task => 
            task.title.toLowerCase().includes(searchTerm)
        );
    }

    listContainer.empty();

    if (filteredList.length === 0) {
        $('#emptyState').show();
    } else {
        $('#emptyState').hide();

        filteredList.forEach(task => {
            const completedClass = task.completed ? 'completed' : '';
            const isChecked = task.completed ? 'checked' : '';

            const itemHtml = `
                <li class="todo-item ${completedClass}" data-id="${task.id}">
                    <div class="checkbox-wrapper">
                        <input 
                            type="checkbox" 
                            class="task-checkbox" 
                            ${isChecked} 
                            aria-label="Mark task as complete"
                        >
                    </div>
                    <div class="task-content">
                        <span class="task-text">${escapeHtml(task.title)}</span>
                        <span class="priority-tag priority-${task.priority}">${task.priority}</span>
                    </div>
                    <div class="item-actions">
                        <button class="action-icon-btn edit-btn" title="Edit task">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button class="action-icon-btn delete-btn" title="Delete task">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </li>
            `;
            listContainer.append(itemHtml);
        });
    }

    updateCounters();
}

function updateCounters() {
    const total = todoList.length;
    const completed = todoList.filter(t => t.completed).length;
    const pending = total - completed;

    $('#badgeAll').text(total);
    $('#badgePending').text(pending);
    $('#badgeCompleted').text(completed);
    $('#itemsLeftCount').text(`${pending} item${pending === 1 ? '' : 's'} left`);
}

function updateServerStatusBadge(connected) {
    if (connected) {
        $('#serverStatusBadge').html('<i class="fa-solid fa-circle" style="color:#10b981; font-size:9px;"></i> Servlet: Connected');
    } else {
        $('#serverStatusBadge').html('<i class="fa-solid fa-circle" style="color:#f59e0b; font-size:9px;"></i> Servlet API Ready');
    }
}

// ==============================================================================
// 5. JSON HANDLING & LOCAL PERSISTENCE FALLBACK
// ==============================================================================

function saveTodosToStorage() {
    try {
        const jsonString = JSON.stringify(todoList);
        localStorage.setItem(STORAGE_KEY, jsonString);
    } catch (e) {
        console.error("Error saving todos:", e);
    }
}

function loadTodosFromStorage() {
    try {
        const rawJson = localStorage.getItem(STORAGE_KEY);
        if (rawJson) {
            todoList = JSON.parse(rawJson);
        } else {
            todoList = [
                {
                    id: 101,
                    title: "Develop responsive HTML/CSS interface",
                    priority: "High",
                    completed: true,
                    createdAt: "10:00 AM"
                },
                {
                    id: 102,
                    title: "Implement JavaScript arrays, objects & JSON handling",
                    priority: "High",
                    completed: true,
                    createdAt: "10:30 AM"
                },
                {
                    id: 103,
                    title: "Connect jQuery $.ajax to TodoServlet (/api/todos)",
                    priority: "Normal",
                    completed: false,
                    createdAt: "11:00 AM"
                }
            ];
            saveTodosToStorage();
        }
    } catch (e) {
        console.error("Error loading todos:", e);
        todoList = [];
    }
}

function openJsonModal() {
    const formattedJson = JSON.stringify(todoList, null, 2);
    $('#jsonDisplay').text(formattedJson);
    $('#jsonModal').removeClass('hidden');
}

function downloadJsonFile() {
    const jsonString = JSON.stringify(todoList, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
