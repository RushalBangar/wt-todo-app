package com.todo.action;

import com.todo.model.Todo;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * TodoAction
 * Fulfills syllabus requirement: "Struts Action for CRUD operations"
 * 
 * Maps web actions to Create, Read, Update, Delete methods in a Struts 2 architecture.
 */
public class TodoAction {

    // In-memory persistent data store
    private static List<Todo> todoRepository = new ArrayList<>();

    static {
        // Sample seed data
        todoRepository.add(new Todo(1, "Build responsive interface", "High", true, "09:00 AM"));
        todoRepository.add(new Todo(2, "Test Struts Action CRUD operations", "High", false, "10:00 AM"));
    }

    // Form / Action properties
    private long id;
    private String title;
    private String priority;
    private boolean completed;
    private List<Todo> todos;

    // =========================================================================
    // CRUD OPERATIONS
    // =========================================================================

    /**
     * READ Operation: Fetches all todos
     * Invoked by: /listTodos.action
     */
    public String execute() {
        this.todos = todoRepository;
        return "success";
    }

    /**
     * CREATE Operation: Adds a new todo item
     * Invoked by: /createTodo.action
     */
    public String create() {
        if (title != null && !title.trim().isEmpty()) {
            long newId = System.currentTimeMillis();
            String time = new SimpleDateFormat("hh:mm a").format(new Date());
            Todo newTodo = new Todo(newId, title, priority != null ? priority : "Normal", false, time);
            todoRepository.add(newTodo);
        }
        this.todos = todoRepository;
        return "success";
    }

    /**
     * UPDATE Operation: Toggles or edits a todo item
     * Invoked by: /updateTodo.action
     */
    public String update() {
        for (Todo t : todoRepository) {
            if (t.getId() == this.id) {
                t.setCompleted(!t.isCompleted());
                break;
            }
        }
        this.todos = todoRepository;
        return "success";
    }

    /**
     * DELETE Operation: Removes a todo by ID
     * Invoked by: /deleteTodo.action
     */
    public String delete() {
        todoRepository.removeIf(t -> t.getId() == this.id);
        this.todos = todoRepository;
        return "success";
    }

    // =========================================================================
    // Getters and Setters for Struts ValueStack
    // =========================================================================

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public List<Todo> getTodos() {
        return todos;
    }

    public void setTodos(List<Todo> todos) {
        this.todos = todos;
    }
}
