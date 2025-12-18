// Load preset tasks to start page

const parentDiv = document.querySelector('.current-project-list')

function loadPresetTasks(list, amount) {
    for (let i = 0; i < amount; i++) {
        const currentTask = list[i]
        const html = `
             <li data-index="${i}">${currentTask.title}</li>
            `
        parentDiv.insertAdjacentHTML('beforeend', html)
    }
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
        loggerFunction(list, amount)
        loadPresetTasks(list, amount)
    }
}

function loggerFunction(list, amount) {
    console.log(`You have ${amount} tasks left`)
    for (let i = 0; i < amount; i++) {
        console.log(`To Do List: ${list[i].title} | due: ${list[i].dueDate} | description: ${list[i].description} | priority: ${list[i].priority}`)
    }


}

function createTask(title, dueDate, description, priority) {
    new Tasks(title, dueDate, description, priority)
}

createTask("Make dinner", "today", "I'm gonna make a nice dinner for my girlfriend", "high")
createTask("Program something cool", "Everyday")
createTask("Clean my desk", "Today", "pls clean my desk")

Tasks.logger()



// display clicked task
parentDiv.addEventListener("click", (e) => {
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
const closeBtn = document.querySelector("#close-modal");


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
closeBtn.addEventListener('click', hideModal)
// hide when pressing background
overlay.addEventListener('click', hideModal)

// grab task data and display it to task

const submitTaskBtn = document.querySelector("#submit-task");

submitTaskBtn.addEventListener("click", (e) => {
    console.log("button clicked")
    // 1. Prevent the form from refreshing the page
    e.preventDefault();

    // 2. Grab the values
    const title = document.querySelector("#task-title").value;
    const date = document.querySelector("#task-date").value;
    const desc = document.querySelector("#task-desc").value;

    // 3. 'selectedPriority' comes from your priority buttons logic
    //   const priority = selectedPriority;

    const checkedRadio = document.querySelector('input[name="priority"]:checked');
    const priority = checkedRadio.value;
    //console.log(priority);
   
    if (checkedRadio) {
        console.log(priority); // "High", "Medium", or "Low"
    }

    // 4. Validate (Make sure it's not empty)
    if (!title || !date) {
        alert("Please fill out the title and date!");
        return;
    }
 
    // 5. Create your new Task object
    createTask(title, date, desc, priority)

    // 6. Clear the form and hide the modal
    hideModal()
    resetForm()
    Tasks.logger()
    console.log(myTasks)
});

function resetForm() {
  document.querySelector("#task-title").value = "";
  document.querySelector("#task-date").value = "";
  document.querySelector("#task-desc").value = "";

  const checkedRadio = document.querySelector('input[name="priority"]:checked');

  // Use "if" to make sure a radio was actually selected before trying to uncheck it
  if (checkedRadio) {
    checkedRadio.checked = false;
  }
}
