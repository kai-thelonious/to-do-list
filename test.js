// Load preset tasks to start page
function displayTasks(list, amount) {
    const parentDiv = document.querySelector(".current-project-list")
    let html = ''
    for (let i = 0; i < amount; i++) {
        const currentTask = list[i]
        html += `
             <li data-index="${i}">${currentTask.title}</li>
            `;
    }
    parentDiv.innerHTML = html
}


// load preset projects
function displayProjects(list, amount) {
    const parentDiv = document.querySelector(".project-list")
    let html = ''
    for (let i = 0; i < amount; i++) {
      const project = list[i];
      html += `
             <li data-index="${i}">${project.title}</li>
            `
    }
    parentDiv.innerHTML = html
}


// project factory
let myProjects = []

class Projects {
    constructor(title) {
        this.title = title;
        console.log(this)
        myProjects.push(this);
    }
    static logger() {
        const amount = myProjects.length;
        const list = myProjects;
        displayProjects(list, amount);
    }
}

function createProject(title) {
    new Projects(title)
}


// task factory
let myTasks = []

class Tasks {
    constructor(title, dueDate, description, priority) {
        this.title = title
        this.dueDate = dueDate
        this.description = description
        this.priority = priority

        myTasks.push(this)
    }

    static logger() {
        const amount = myTasks.length
        const list = myTasks
        displayTasks(list, amount)
    }
}

function createTask(title, dueDate, description, priority) {
    new Tasks(title, dueDate, description, priority)
}

// Load presets
createTask("Make dinner", "today", "I'm gonna make a nice dinner for my girlfriend", "high")
createTask("Program something cool", "Everyday")
createTask("Clean my desk", "Today", "pls clean my desk")

createProject("Work")
createProject("Home");
createProject("Other");
Tasks.logger()
Projects.logger()

// display clicked task
const parentTaskDiv = document.querySelector(".current-project-list");
parentTaskDiv.addEventListener("click", (e) => {
    console.log("clicked on:", e.target)
    const taskItem = e.target
    if (taskItem) {
        const index = taskItem.getAttribute('data-index')
        console.log(index)
        const taskData = myTasks[index]
        console.log(taskData)
        showTask(taskData)
    }
})


// display selected task
const currentTaskParentDiv = document.querySelector('.current-task')

function showTask(task) {
    // currentTaskParentDiv.classList.toggle('hidden')
    currentTaskParentDiv.classList.remove('hidden')
    const html = `
           
                    <div class="task-title">
                        <h2>${task.title}</h2>
                        <h4 class="priority">High Priority</h4>
                    </div>
                
                    <p class="task-due">Task due: ${task.dueDate}</p>

                    <div class="description-div">
                        <p class="description">Description:</p>
                        <p class="description" id="user-description">${task.description}</p>
                    </div>    
        
    `
    const taskDiv = document.querySelector('.current-task')
    taskDiv.innerHTML = html

}



//add project, add task buttons & modal
const overlay = document.querySelector("#modal-overlay");
const modalTask = document.querySelector("#task-modal");
const modalProject = document.querySelector("#project-modal");

const addProjectBtn = document.querySelector("#add-new-project-btn");
const addTaskBtn = document.querySelector("#add-new-task-btn");
const closeBtn = document.querySelectorAll(".close-modal")

// add project
addProjectBtn.addEventListener('click', () => {
    modalProject.classList.remove("hidden");
    overlay.classList.remove("hidden");
 
})

// add task
addTaskBtn.addEventListener('click', () => {
    modalTask.classList.remove('hidden')
    overlay.classList.remove('hidden')

})

// hide the modal function
const hideModal = () => {
    modalTask.classList.add('hidden')
    modalProject.classList.add('hidden')
    overlay.classList.add('hidden')
}

// hide when pressing close button
closeBtn.forEach((btn) => {
    btn.addEventListener("click", hideModal);
})

// hide when pressing background
overlay.addEventListener('click', hideModal)

// grab task data and display it to task
const submitTaskBtn = document.querySelector("#submit-task");
submitTaskBtn.addEventListener("click", submitTask);



function submitTask() {
     const title = document.querySelector("#task-title").value;
     const date = document.querySelector("#task-date").value;
     const desc = document.querySelector("#task-desc").value;
     const checkedRadio = document.querySelector(
       'input[name="priority"]:checked'
     );
    const priority = checkedRadio.value;

     if (checkedRadio) {
       console.log(priority) // "High", "Medium", or "Low"
     }
     if (!title || !date) {
       alert("Please fill out the title and date!")
       return;
     }

     // 5. Create your new Task object
     createTask(title, date, desc, priority);

     // 6. Clear the form and hide the modal
     hideModal();
     resetForm();
     Tasks.logger();
     console.log(myTasks);
}

// submit project
const submitProjectBtn = document.querySelector("#submit-project")
submitProjectBtn.addEventListener('click', submitProject)

function submitProject() {
    const title = document.querySelector("#project-title").value;
    if (!title) {
        alert("Please enter a project title")
        return
    }
   
    createProject(title)
    hideModal()
    title.innerHTML = ''
    Projects.logger()
    console.log(myProjects)
}

function resetForm() {
  document.querySelector("#task-title").value = "";
  document.querySelector("#task-date").value = "";
  document.querySelector("#task-desc").value = "";

  const checkedRadio = document.querySelector('input[name="priority"]:checked');

  if (checkedRadio) {
    checkedRadio.checked = false;
  }
}
