function handleAddTask (event){
    let newTask = event.target.nextElementSibling.value;
    if(newTask === "")
    alert("can't add empty task");
    let newTaskEl = document.createElement("li");
    newTaskEl.classList.add("task");
    newTaskEl.innerText = newTask;
    let taskList = document.getElementsByTagName("ul")[event.target.parentNode.id];
    taskList.insertBefore(newTaskEl, taskList.childNodes[0]);
    //const tasks = localStorage.getItem("tasks");
    tasks[event.target.parentNode.dataset.action].unshift(newTask);  
    localStorage.setItem("tasks", JSON.stringify(tasks));  
    
}
function handleDBclick (event){
    if(event.target.tagName !== "LI") return;
    let tempInput = document.createElement("input");
    tempInput.setAttribute("type", "text");
    tempInput.setAttribute("value", event.target.innerHTML);
    let tempI = tasks[event.target.closest("section").dataset.action].indexOf(tempInput.value);
    event.target.innerHTML = "";
    event.target.append(tempInput);
    tempInput.onblur = () => {
        tasks[event.target.closest("section").dataset.action][tempI] = tempInput.value;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        event.target.innerHTML = tempInput.value;
    }
}
function loadTasks () {
    if(!localStorage.getItem("tasks"))
    localStorage.setItem("tasks", JSON.stringify(tasks)) //return false;
    tasks = JSON.parse(localStorage.getItem("tasks"));
    //tasks = localStorage.getitem("tasks");
    //tasks = json.parse(tasks);
    let classI = 0;
    let newLi;
    for(let task in tasks){
        for(let i = 0; i < tasks[task].length; i++){
            newLi =  document.createElement("li");
            newLi.innerHTML = tasks[task][i];
            document.getElementById(classI).getElementsByTagName("ul")[0].append(newLi);
        }
        classI++;
    }
    return true;
}
function handleMouseOver(event) {
    if(event.target.tagName !== "LI") return;
    //if(event.altKey === true){
    //event.target.addEventListener("keypress", (key) =>{
      //if(key.charCode === 2){ 
         // alert("sdf"); 
      // document.getElementsByClassName("in-progress-tasks")[0].append(event.target);
    
}
function search (key) {
    let liArr = document.querySelectorAll("li");
    console.log(key.key);
    let query;
        query = document.getElementById("search").value;
    for(let i = 0; i < liArr.length; i++){
        if(liArr[i].innerText.includes(query) === false)
        liArr[i].hidden = true;
        else
        liArr[i].hidden = false;
        
    }
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

/*let tasks = {
    todo: [],
    "in-progress": [],
    done: []
}
if(!loadTasks()){
localStorage.setItem("tasks", JSON.stringify(tasks));
}*/



