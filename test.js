// --- Model: Data & Logic ---

class Project {
  constructor(title) {
    this.title = title;
  }
}

class Task {
  constructor(title, dueDate, description, priority, projectIndex) {
    this.title = title;
    this.dueDate = dueDate;
    this.description = description;
    this.priority = priority;
    this.projectIndex = projectIndex;
  }
}

const TodoManager = {
  projects: [],
  tasks: [],

  addProject(title) {
    const newProject = new Project(title);
    this.projects.push(newProject);
    return newProject;
  },

  addTask(title, dueDate, description, priority, projectIndex) {
    const newTask = new Task(title, dueDate, description, priority, projectIndex);
    this.tasks.push(newTask);
    return newTask;
  },

  getProjects() {
    return this.projects;
  },

  getTasks(projectIndex = null) {
    if (projectIndex === null) {
      return this.tasks;
    }
    return this.tasks.filter(task => task.projectIndex == projectIndex);
  }
};

// --- View: DOM Manipulation ---

const UIManager = {
  // Cache DOM elements
  elements: {
    projectList: document.querySelector(".project-list"),
    taskList: document.querySelector(".current-project-list"),
    tasks: document.querySelector(".current-project"),
    taskDetails: document.querySelector(".current-task"),
    projectHeader: document.querySelector(".current-project h2"),
    
    // Modals & Overlay
    overlay: document.querySelector("#modal-overlay"),
    modalTask: document.querySelector("#task-modal"),
    modalProject: document.querySelector("#project-modal"),
    
    // Form Inputs
    taskTitleInput: document.querySelector("#task-title"),
    taskDateInput: document.querySelector("#task-date"),
    taskDescInput: document.querySelector("#task-desc"),
    projectTitleInput: document.querySelector("#project-title"),
    taskProjectSelect: document.querySelector("#task-project-select"),
  },

  renderTasks(tasks) {
    let html = "";
    if (tasks.length === 0) {
      html = "<li>No tasks found for this project.</li>";
    } else {
      tasks.forEach((task, index) => {
        html += `<li data-index="${index}">${task.title}</li>`;
      });
    }
    this.elements.taskList.innerHTML = html;
  },

  renderProjects(projects) {
    let html = "";
    projects.forEach((project, index) => {
      html += `<li data-index="${index}">${project.title}</li>`;
    });
    this.elements.projectList.innerHTML = html;
    this.populateProjectSelect(projects);
  },

  updateProjectHeader(title) {
    this.elements.projectHeader.textContent = `${title} — Tasks`;
  },

  populateProjectSelect(projects) {
    let html = "";
    projects.forEach((project, index) => {
      html += `<option value="${index}">${project.title}</option>`;
    });
    if(this.elements.taskProjectSelect) {
        this.elements.taskProjectSelect.innerHTML = html;
    }
  },

  showTaskDetails(task) {


    this.elements.taskDetails.classList.remove("hidden");
    const html = `
      <div class="task-title">
          <h2>${task.title}</h2>
          <h4 class="priority">Priority: ${task.priority || 'Normal'}</h4>
      </div>
  
      <p class="task-due">Task due: ${task.dueDate}</p>

      <div class="description-div">
          <p class="description">Description:</p>
          <p class="description" id="user-description">${task.description || 'No description provided.'}</p>
      </div>    
    `;
    this.elements.taskDetails.innerHTML = html;
  },

  openModal(type) {
    this.elements.overlay.classList.remove("hidden");
    if (type === 'task') {
      this.elements.modalTask.classList.remove("hidden");
    } else if (type === 'project') {
      this.elements.modalProject.classList.remove("hidden");
    }
  },

  closeModals() {
    this.elements.overlay.classList.add("hidden");
    this.elements.modalTask.classList.add("hidden");
    this.elements.modalProject.classList.add("hidden");
  },

  resetForms() {
    this.elements.taskTitleInput.value = "";
    this.elements.taskDateInput.value = "";
    this.elements.taskDescInput.value = "";
    this.elements.projectTitleInput.value = "";
    
    const checkedRadio = document.querySelector('input[name="priority"]:checked');
    if (checkedRadio) checkedRadio.checked = false;
  }
};

// --- Controller: App Logic & Events ---

const App = {
  currentProjectIndex: 0, // Default to first project

  init() {
    this.loadPresets();
    this.renderAll();
    this.bindEvents();
    // Initial load for default project
    this.switchProject(0);
  },

  loadPresets() {
    TodoManager.addProject("Work");  // Index 0
    TodoManager.addProject("Home");  // Index 1
    TodoManager.addProject("Other"); // Index 2

    // Work Tasks
    TodoManager.addTask("Complete report", "2023-10-27", "Finish the quarterly report", "high", 0);
    TodoManager.addTask("Email boss", "2023-10-28", "Ask for a raise", "medium", 0);

    // Home Tasks
    TodoManager.addTask("Make dinner", "today", "I'm gonna make a nice dinner for my girlfriend", "high", 1);
    TodoManager.addTask("Clean my desk", "Today", "pls clean my desk", "low", 1);

    // Other Tasks
    TodoManager.addTask("Program something cool", "Everyday", "Keep coding!", "medium", 2);
  },

  renderAll() {
    UIManager.renderProjects(TodoManager.getProjects());
    // Render tasks for the current project
    UIManager.renderTasks(TodoManager.getTasks(this.currentProjectIndex));
  },

  switchProject(index) {
    this.currentProjectIndex = index;
    const project = TodoManager.getProjects()[index];
    UIManager.updateProjectHeader(project.title);
    UIManager.renderTasks(TodoManager.getTasks(index));
  },

  handleTaskSubmit() {
    const title = UIManager.elements.taskTitleInput.value;
    const date = UIManager.elements.taskDateInput.value;
    const desc = UIManager.elements.taskDescInput.value;
    const projectIndex = UIManager.elements.taskProjectSelect.value;
    const checkedRadio = document.querySelector('input[name="priority"]:checked');
    const priority = checkedRadio ? checkedRadio.value : "Normal";

    if (!title || !date) {
      alert("Please fill out the title and date!");
      return;
    }

    TodoManager.addTask(title, date, desc, priority, projectIndex);
    
    UIManager.closeModals();
    UIManager.resetForms();
    
    // Refresh current view if we added to the current project
    if (projectIndex == this.currentProjectIndex) {
        UIManager.renderTasks(TodoManager.getTasks(this.currentProjectIndex));
    }
  },

  handleProjectSubmit() {
    const title = UIManager.elements.projectTitleInput.value;
    
    if (!title) {
      alert("Please enter a project title");
      return;
    }

    TodoManager.addProject(title);
    
    UIManager.closeModals();
    UIManager.resetForms();
    UIManager.renderProjects(TodoManager.getProjects());
  },

  bindEvents() {
    // Open Modals
    document.querySelector("#add-new-project-btn").addEventListener("click", () => UIManager.openModal('project'));
    document.querySelector("#add-new-task-btn").addEventListener("click", () => {
        // Pre-select current project in the dropdown
        UIManager.elements.taskProjectSelect.value = this.currentProjectIndex;
        UIManager.openModal('task');
    });

    // Close Modals
    document.querySelectorAll(".close-modal").forEach(btn => {
      btn.addEventListener("click", () => UIManager.closeModals());
    });
    UIManager.elements.overlay.addEventListener("click", () => UIManager.closeModals());

    // Submit Forms
    document.querySelector("#submit-task").addEventListener("click", () => this.handleTaskSubmit());
    document.querySelector("#submit-project").addEventListener("click", () => this.handleProjectSubmit());

    // Task List Interaction
    UIManager.elements.taskList.addEventListener("click", (e) => {
      if (e.target.tagName === 'LI') {
        const index = e.target.getAttribute("data-index");
        // Note: The index in the list matches the index in the filtered array, not the global tasks array
        // We need to get the filtered list again to find the correct task object
        const currentTasks = TodoManager.getTasks(this.currentProjectIndex);
        const task = currentTasks[index];
        UIManager.showTaskDetails(task);
      }
    });

    // Project List Interaction
    UIManager.elements.projectList.addEventListener("click", (e) => {
      if (e.target.tagName === 'LI') {
        const index = e.target.getAttribute("data-index");
        this.switchProject(index);
      }
    });
  }
};

// Start the App
App.init();