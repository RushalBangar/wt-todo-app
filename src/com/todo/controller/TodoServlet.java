package com.todo.controller;

import com.todo.model.Todo;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * TodoServlet
 * Fulfills syllabus requirement: "Implement Servlet for data persistence"
 * 
 * Manages CRUD operations and persists data across user sessions using HttpSession.
 */
@WebServlet(name = "TodoServlet", urlPatterns = {"/api/todos"})
public class TodoServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String SESSION_KEY = "user_todo_list";

    /**
     * READ: Returns all todos for the current session as JSON
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        List<Todo> todos = getSessionTodos(request);

        // Serialize todos list to JSON array
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < todos.size(); i++) {
            json.append(todos.get(i).toJson());
            if (i < todos.size() - 1) {
                json.append(",");
            }
        }
        json.append("]");

        PrintWriter out = response.getWriter();
        out.print(json.toString());
        out.flush();
    }

    /**
     * CREATE / UPDATE / DELETE operations
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String action = request.getParameter("action");
        List<Todo> todos = getSessionTodos(request);

        if ("create".equalsIgnoreCase(action)) {
            // CREATE operation
            String title = request.getParameter("title");
            String priority = request.getParameter("priority");
            if (priority == null || priority.isEmpty()) {
                priority = "Normal";
            }

            long newId = System.currentTimeMillis();
            String time = new SimpleDateFormat("hh:mm a").format(new Date());

            Todo newTodo = new Todo(newId, title, priority, false, time);
            todos.add(newTodo);

        } else if ("toggle".equalsIgnoreCase(action)) {
            // UPDATE: Toggle status
            long id = Long.parseLong(request.getParameter("id"));
            for (Todo t : todos) {
                if (t.getId() == id) {
                    t.setCompleted(!t.isCompleted());
                    break;
                }
            }

        } else if ("delete".equalsIgnoreCase(action)) {
            // DELETE operation
            long id = Long.parseLong(request.getParameter("id"));
            todos.removeIf(t -> t.getId() == id);

        } else if ("clearCompleted".equalsIgnoreCase(action)) {
            // DELETE BATCH operation
            todos.removeIf(Todo::isCompleted);
        }

        // Return the updated list
        doGet(request, response);
    }

    /**
     * Helper to retrieve or initialize session-persisted Todo list
     */
    @SuppressWarnings("unchecked")
    private List<Todo> getSessionTodos(HttpServletRequest request) {
        HttpSession session = request.getSession(true);
        List<Todo> todos = (List<Todo>) session.getAttribute(SESSION_KEY);

        if (todos == null) {
            todos = new ArrayList<>();
            // Initial seed data
            todos.add(new Todo(101, "Develop responsive HTML/CSS interface", "High", true, "10:00 AM"));
            todos.add(new Todo(102, "Implement JavaScript arrays, objects & JSON", "High", true, "10:30 AM"));
            todos.add(new Todo(103, "Implement Servlet for data persistence", "Normal", false, "11:00 AM"));
            session.setAttribute(SESSION_KEY, todos);
        }
        return todos;
    }
}
