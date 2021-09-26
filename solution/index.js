
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
            newLi.classList.add("task");
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
    document.addEventListener("keydown", keyPressMove);
}
function keyPressMove(e) {
    let task = document.getElementsByClassName("active")[0];
    let prevUl = task.closest("section").dataset.action;
    prevUlindex = tasks[prevUl].indexOf(task.innerText)
    if(e.altKey && (e.key === "1" || e.key === "2" || e.key === "3")){
    let indexUl = e.key - 1;
    let targetUl = document.getElementsByTagName("ul")[indexUl];
    targetUl.insertBefore(task, targetUl.childNodes[0]);
    if(e.key === "3"){
        document.getElementById("wellDone").style.display = "block";
        setTimeout(function() {document.getElementById("wellDone").style.display = "none";}, 4000);
    }
    tasks[targetUl.parentNode.dataset.action].unshift(task.innerText);
    tasks[prevUl].splice(prevUlindex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    }
}
function mouseOutElement(event) {
    if(event.target.tagName !== "LI") return;
    event.target.classList.remove("active");
    document.removeEventListener("keydown", keyPressMove);
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
    let load = document.createElement("div");
    load.setAttribute("id", "loading");
    document.body.appendChild(load);
    load.classList.add("loader");
    displayLoading();
    let tempTasks = JSON.parse(localStorage.getItem("tasks"));  //
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
   // hideLoading();
    load.remove();
}
async function loadApi() {
    let load = document.createElement("div");
    load.setAttribute("id", "loading");
    document.body.appendChild(load);
    load.classList.add("loader");
    displayLoading();
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
   // hideLoading();
    load.remove();
    return;
    }
    let tasksI = await response.json();
    tasks = tasksI.tasks;
    localStorage.setItem("tasks", JSON.stringify(tasks));  //
   // hideLoading();
    load.remove();
    loadTasks();
    
}
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

//const loader = document.querySelector("#loading");
function displayLoading() {
    let loader = document.querySelector("#loading");
    loader.classList.add("display");
    //setTimeout(() => {
      //  loader.classList.remove("loader");
    //}, 5000);
}
 
function hideLoading() {
    let loader = document.querySelector("#loading");
    loader.classList.remove("display");
}


