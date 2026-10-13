package com.todo.model;

import java.io.Serializable;

/**
 * Todo Model Bean
 * Represents a single Todo item in the Java backend.
 */
public class Todo implements Serializable {
    private static final long serialVersionUID = 1L;

    private long id;
    private String title;
    private String priority;
    private boolean completed;
    private String createdAt;

    // Default Constructor
    public Todo() {
    }

    // Parameterized Constructor
    public Todo(long id, String title, String priority, boolean completed, String createdAt) {
        this.id = id;
        this.title = title;
        this.priority = priority;
        this.completed = completed;
        this.createdAt = createdAt;
    }

    // Getters and Setters
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

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Converts this object to a simple JSON representation
     * (Useful without needing third-party JARs)
     */
    public String toJson() {
        return String.format(
            "{\"id\":%d,\"title\":\"%s\",\"priority\":\"%s\",\"completed\":%b,\"createdAt\":\"%s\"}",
            id,
            title.replace("\"", "\\\""),
            priority,
            completed,
            createdAt
        );
    }
}
