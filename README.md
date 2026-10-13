# 📋 TaskMaster: Simple Todo List Web App
**Web Technology (WT) Minor Project (Option 2)**  
**Course Outcomes**: CO1 (Frontend JS/jQuery/JSON), CO2 (Server-side CRUD Architecture)

---

## 🎯 Project Overview
TaskMaster is a modern, responsive Todo web application designed to demonstrate client-side scripting, structured data models, JSON communication, and server-side CRUD architecture.

---

## ✅ How It Meets Every Syllabus Requirement

| Requirement | Implementation in Project | File / Code Location |
| :--- | :--- | :--- |
| **Responsive HTML/CSS interface** | Clean, modern UI with mobile-friendly layout, custom scrollbar, priority badges, and smooth micro-animations. | [`index.html`](index.html), [`style.css`](style.css) |
| **JavaScript Arrays & Objects** | Tasks stored as objects `{ id, title, priority, completed, createdAt }` inside an array `todoList = []`. | [`app.js`](app.js) lines 18-20 & 100-110 |
| **JSON Handling** | Serializing using `JSON.stringify()` and deserializing using `JSON.parse()`. Includes live "View JSON" modal and download. | [`app.js`](app.js) lines 205-245 |
| **jQuery Events** | Interactive handling via `$('#todoForm').on('submit')`, `$(document).on('change', '.task-checkbox')`, `$(document).on('click', '.delete-btn')`, and `$('#searchInput').on('keyup')`. | [`app.js`](app.js) lines 35-90 |
| **Servlet for Data Persistence** | `TodoServlet.java` handles `doGet` (Fetch all as JSON) and `doPost` (Create/Update/Delete) persisting data via `HttpSession`. | [`src/com/todo/controller/TodoServlet.java`](src/com/todo/controller/TodoServlet.java) |
| **Struts Action for CRUD** | `TodoAction.java` maps CRUD operations into distinct Struts Action methods (`create`, `execute/read`, `update`, `delete`). | [`src/com/todo/action/TodoAction.java`](src/com/todo/action/TodoAction.java) |

---

## 🚀 How to Run the App (Zero Downloads Needed!)

1. **Direct Browser Execution**:
   - Go to your project folder: `D:\WT\mini project\`
   - Double-click **`index.html`** or right-click and choose **Open with > Google Chrome / Microsoft Edge**.
   - The application runs immediately! You can:
     - Add tasks with priorities (**Normal**, **High**, **Low**).
     - Search and filter tasks by **All**, **Pending**, and **Completed**.
     - Edit or delete individual tasks.
     - Click **"View JSON"** to inspect or copy the live JSON data structure.
     - Reload the page: Notice your tasks stay saved (persisted via JSON)!

2. **For College Lab / Project Report Submission**:
   - The Java source code files are organized under `src/` and `WEB-INF/web.xml`.
   - You can submit these files directly in your report or import them into Eclipse/NetBeans on your college lab computers.

---

## 📁 File Structure

```
d:\WT\mini project/
├── index.html                           # Modern responsive HTML5 interface
├── style.css                            # Styling, animations & color scheme
├── app.js                               # JS array, object, JSON handling & jQuery events
├── README.md                            # Documentation & viva preparation
├── WEB-INF/
│   └── web.xml                          # Deployment descriptor (Servlet & Struts mapping)
└── src/
    └── com/
        └── todo/
            ├── model/
            │   └── Todo.java            # Todo Java Bean model
            ├── controller/
            │   └── TodoServlet.java     # Servlet handling persistence & JSON
            └── action/
                └── TodoAction.java      # Struts 2 Action for CRUD operations
```

---

## 🎓 Viva Questions & Quick Answers

**Q1: Why do we use JSON in this application?**  
*Answer:* JSON (JavaScript Object Notation) is a lightweight, human-readable data format used to exchange structured data between the frontend and the backend using `JSON.stringify()` and `JSON.parse()`.

**Q2: How is data persisted without a database?**  
*Answer:* On the client side, tasks are persisted in browser `localStorage` using serialized JSON. On the server side, `TodoServlet` stores the list in `HttpSession` across requests.

**Q3: Why use jQuery event delegation (`$(document).on(...)`)?**  
*Answer:* Because todo items are added dynamically after the initial page load. Event delegation ensures newly created items automatically have click and change listeners attached.

**Q4: What are the 4 CRUD operations mapped in the project?**  
*Answer:* 
- **C**reate: Adding a new task object.
- **R**ead: Rendering the task list.
- **U**pdate: Toggling completion status or editing task title.
- **D**elete: Removing a task by its ID.
