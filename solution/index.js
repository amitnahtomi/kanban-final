function handleAddTask (event){
    let newTask = event.target.nextElementSibling.value;
    if(newTask === "")
    alert("can't add empty task");
    let newTaskEl = document.createElement("li");
    newTaskEl.innerHTML = newTask;
    let taskList = document.getElementsByTagName("ul")[event.target.parentNode.id];
    taskList.append(newTaskEl);
    localStorage.getItem("todo").push(JSON.stringify(newTaskEl));
}
function handleDBclick (event){
    let tempInput = document.createElement("input");
    tempInput.setAttribute("type", "text");
    tempInput.setAttribute("value", event.target.innerHTML);
    event.target.innerHTML = "";
    event.target.append(tempInput);
    event.target.onkeydown = (key) => {
        if(key.keyCode === 13)
        event.target.innerHTML = tempInput.value;
    }
}
function handleMouseOver(event) {
    if(event.altKey === true && event.keyCode === 50){
       document.getElementsByClassName("in-progress-tasks")[0].append(event.target.parentNode);
    }
}
    //alert("svd");
        /*if(event.getModifierState("alt") || key.keyCode === 49){
        document.getElementsByClassName("to-do-tasks")[0].append(event.target);
    }
        if(event.getModifierState("alt") || key.keyCode === 50)
        document.getElementsByClassName("in-progress-tasks")[0].append(event.target);
    }*/
document.getElementById("submit-add-to-do").addEventListener("click", handleAddTask);
document.getElementsByClassName("to-do-tasks")[0].addEventListener("dblclick", handleDBclick);
document.getElementsByClassName("to-do-tasks")[0].addEventListener("keypress", handleMouseOver);
let todoArr = ["dsadsa", "asds", "asdsd"];
localStorage.setItem("todo",JSON.stringify(todoArr));
