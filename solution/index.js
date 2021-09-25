
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
    localStorage.setItem("tasks", JSON.stringify(tasks));  
    
}
function handleDBclick (event){
    if(event.target.tagName !== "LI") return;
    let task = event.target.innerText;
    let targetArr = event.target.closest("section").dataset.action;
    let taskI = tasks[targetArr].indexOf(task);
    event.target.contentEditable = true;
    event.target.focus();
    event.target.onblur = () => {
        if(event.target.innerText=="") {
            event.target.focus();
            return;
        }
        let updateTask = event.target.innerText;
        tasks[targetArr][taskI] = updateTask;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        event.target.contentEditable = false
    }
    
}
function loadTasks () {
    if(!localStorage.getItem("tasks"))
    localStorage.setItem("tasks", JSON.stringify(tasks))
    tasks = JSON.parse(localStorage.getItem("tasks"));
    let classI = 0;
    let newLi;
    for(let task in tasks){
        for(let i = 0; i < tasks[task].length; i++){
            newLi =  document.createElement("li");
            newLi.classList.add("task")
            newLi.innerHTML = tasks[task][i];
            document.getElementsByTagName("ul")[classI].append(newLi);
        }
        classI++;
    }
    return true;
}
function handleMouseOver(event) {
    if(event.target.tagName !== "LI") return; 
    event.target.classList.add("active");
    document.addEventListener("keypress", keyDownMove);
}
function keyDownMove(e) {
    let task = document.getElementsByClassName("active")[0];
    let prevUl = task.closest("section").dataset.action;
    prevUlindex = tasks[prevUl].indexOf(task.innerText)
    if(e.key === "1" || e.key === "2" || e.key === "3"){
        console.log(e.altKey);
    let indexUl = e.key - 1;
    let targetUl = document.getElementsByTagName("ul")[indexUl];
    targetUl.insertBefore(task, targetUl.childNodes[0]);
    tasks[targetUl.parentNode.dataset.action].unshift(task.innerText);
    tasks[prevUl].splice(prevUlindex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    }
}
function mouseOutElement(event) {
    if(event.target.tagName !== "LI") return;
    event.target.classList.remove("active");
    document.removeEventListener("keypress", keyDownMove);
}
    
   
    

function search (key) {
    let liArr = document.querySelectorAll("li");
    let query;
        query = document.getElementById("search").value.toUpperCase();
    for(let i = 0; i < liArr.length; i++){
        if(liArr[i].innerText.toLocaleUpperCase().includes(query) === false)
        liArr[i].hidden = true;
        else
        liArr[i].hidden = false;
        
    }
}
function handleBlur (event) {
    alert(event);
    tasks[event.target.closest("section").dataset.action][tempI] = tempInput.value;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    event.target.innerHTML = tempInput.value;
}
async function saveApi() {
    displayLoading();
    let tempTasks = localStorage.getItem("tasks");
    const response = await fetch("https://json-bins.herokuapp.com/bin/614b1c664021ac0e6c080cef", { 
        method: "PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"tasks": tempTasks})
    })
    if(!response.ok){
    alert("oh no! something went wrong");
    }
    hideLoading();
}
async function loadApi() {
    displayLoading();
    let liArr = document.querySelectorAll("li");
    for(let i = 0; i < liArr.length; i++){
        liArr[i].remove();
    } 
    const response = await fetch("https://json-bins.herokuapp.com/bin/614b1c664021ac0e6c080cef");
    if(!response.ok){
    alert("oh no! something went wrong");
    hideLoading();
    return;
    }
    let tasksI = await response.json();
    tasks = tasksI.tasks;
    console.log(tasks);
    localStorage.setItem("tasks", tasks);
    loadTasks();
    hideLoading();
}
let tasks = {
    todo: [],
    "in-progress": [],
    done: []
}
//localStorage.setItem("tasks", JSON.stringify(itemsArray));
//const tasks = JSON.parse(localStorage.getItem("tasks")); 
//if(!loadTasks()){
//localStorage.setItem("tasks", JSON.stringify(tasks));
//}
loadTasks();
document.getElementById("submit-add-to-do").addEventListener("click", handleAddTask);
document.getElementById("submit-add-in-progress").addEventListener("click", handleAddTask);
document.getElementById("submit-add-done").addEventListener("click", handleAddTask);
document.addEventListener("dblclick", handleDBclick);
document.addEventListener("mouseover", handleMouseOver);
document.getElementById("search").addEventListener("keyup", search);
document.addEventListener("mouseout", mouseOutElement);
//document.addEventListener("keydown", keyDownMove);

/*let tasks = {
    todo: [],
    "in-progress": [],
    done: []
}
if(!loadTasks()){
localStorage.setItem("tasks", JSON.stringify(tasks));
}*/
const loader = document.querySelector("#loading");
function displayLoading() {
    loader.classList.add("display");
    // to stop loading after some time
    setTimeout(() => {
        loader.classList.remove("display");
    }, 5000);
}

// hiding loading 
function hideLoading() {
    loader.classList.remove("display");
}



