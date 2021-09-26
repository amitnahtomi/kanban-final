// Add new Task 
function handleAddTask (event){
    let newTask = event.target.nextElementSibling.value;
    if(newTask === ""){
        alert("can't add empty task");
        return;
    }
    let newTaskEl = document.createElement("li");
    newTaskEl.classList.add("task");
    newTaskEl.innerText = newTask;
    newTaskEl.contentEditable = false;
    let taskList = document.getElementsByTagName("ul")[event.target.parentNode.id];
    taskList.insertBefore(newTaskEl, taskList.childNodes[0]);
    tasks[event.target.parentNode.dataset.action].unshift(newTask);  
    localStorage.setItem("tasks", JSON.stringify(tasks));  //save to local storage
    
}
//Edit Task
function handleDBclick (event){
    if(event.target.tagName !== "LI") return;
    let task = event.target.innerText;
    let targetArr = event.target.closest("section").dataset.action;
    let taskI = tasks[targetArr].indexOf(task);
    event.target.contentEditable = true;
    event.target.focus();
    event.target.onblur = () => {
        if(event.target.innerText=="") { //prevent saving empty task
            event.target.focus();
            return;
        }
        let updateTask = event.target.innerText;
        tasks[targetArr][taskI] = updateTask;
        localStorage.setItem("tasks", JSON.stringify(tasks)); //save to local storage
        event.target.contentEditable = false
    }
    
}
//load tasks from local storage
function loadTasks () {
    if(!localStorage.getItem("tasks")) //if no tasks found in local storage save empty tasks jason
        localStorage.setItem("tasks", JSON.stringify(tasks))
    tasks = JSON.parse(localStorage.getItem("tasks"));
    let classI = 0;
    let newLi;
    for(let taskArr in tasks){ //loop over task arrays (to-do \ in progress \ done)
        for(let i = 0; i < tasks[taskArr].length; i++){ //loop over each array
            newLi =  document.createElement("li");
            newLi.classList.add("task");
            newLi.innerHTML = tasks[taskArr][i];
            document.getElementsByTagName("ul")[classI].append(newLi);
        }
        classI++;
    }
}

//handle task mouse over
function handleMouseOver(event) {
    if(event.target.tagName !== "LI") return; 
    event.target.classList.add("active");
    document.addEventListener("keydown", keyPressMove);
}

//handles task move to another section, on mouse over + alt+1-3
function keyPressMove(e) {
    let task = document.getElementsByClassName("active")[0]; //get the active (hovered) task
    let prevUl = task.closest("section").dataset.action; //get active task section
    let prevTaskindex = tasks[prevUl].indexOf(task.innerText) //get active task index
    if(e.altKey && (e.key === "1" || e.key === "2" || e.key === "3")){
        let indexUl = e.key - 1;
        let targetUl = document.getElementsByTagName("ul")[indexUl]; //get destination UL
        targetUl.insertBefore(task, targetUl.childNodes[0]); //insert active task to destination UL
        if(e.key === "3"){ //if task moved to DONE show the welldone gif
            document.getElementById("wellDone").style.display = "block";
            setTimeout(function() {document.getElementById("wellDone").style.display = "none";}, 4000);
        }
        tasks[targetUl.parentNode.dataset.action].unshift(task.innerText); //push task first on target array
        tasks[prevUl].splice(prevTaskindex, 1); //remove task from previous array
        localStorage.setItem("tasks", JSON.stringify(tasks)); //save to local storage

    }
}

//on mouse out - task in no longer active and keydown event removed
function mouseOutElement(event) {
    if(event.target.tagName !== "LI") return;
    event.target.classList.remove("active");
    document.removeEventListener("keydown", keyPressMove);
}
    
     
function search (key) {
    let liArr = document.querySelectorAll("li"); //get all li elements
    let query;
        query = document.getElementById("search").value.toUpperCase();
    for(let i = 0; i < liArr.length; i++){
        if(liArr[i].innerText.toLocaleUpperCase().includes(query))
            liArr[i].hidden = false; //show task if it include search text
        else
            liArr[i].hidden = true; //hide task if it doesn't
        
    }
}

//save tasks to API
async function saveApi() {
    displayLoading(); //show loading gif
    let tempTasks = JSON.parse(localStorage.getItem("tasks"));
    const response = await fetch("https://json-bins.herokuapp.com/bin/614b1c664021ac0e6c080cef", { 
        method: "PUT",
        headers:{
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"tasks": tempTasks})
    })
    if(!response.ok){
        alert("oh no! something went wrong");
    }
    document.getElementById("loading").remove(); //remove loading gif
}

//load tasks from APi
async function loadApi() {
    displayLoading(); //show loading gif
    let liArr = document.querySelectorAll("li");
    for(let i = 0; i < liArr.length; i++){
        liArr[i].remove();
    } 
    const response = await fetch("https://json-bins.herokuapp.com/bin/614b1c664021ac0e6c080cef",  { 
        method: "GET",
        headers:{
            "Accept": "application/json",
            "Content-Type": "application/json"
        }});
    if(!response.ok){
        alert("oh no! something went wrong");
        document.getElementById("loading").remove(); //remove loading gif
        return;
    }
    let tasksI = await response.json();
    tasks = tasksI.tasks;
    localStorage.setItem("tasks", JSON.stringify(tasks)); //save to local storage
    document.getElementById("loading").remove(); //remove loading gif
    loadTasks(); //display tasks
}

//display loading gif
function displayLoading() {
    let load = document.createElement("div");
    load.setAttribute("id", "loading");
    document.body.appendChild(load);
    load.classList.add("loader");
    load.classList.add("display");
}

//empty tasks object
let tasks = {
    "todo": [],
    "in-progress": [],
    "done": []
}
loadTasks();
document.getElementById("submit-add-to-do").addEventListener("click", handleAddTask);
document.getElementById("submit-add-in-progress").addEventListener("click", handleAddTask);
document.getElementById("submit-add-done").addEventListener("click", handleAddTask);
document.addEventListener("dblclick", handleDBclick);
document.addEventListener("mouseover", handleMouseOver);
document.getElementById("search").addEventListener("keyup", search);
document.addEventListener("mouseout", mouseOutElement);

