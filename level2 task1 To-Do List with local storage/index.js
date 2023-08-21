let items = [
    {
        id:1,
        task:"Wake up at 6:00 AM."
    },
    {
        id:2,
        task:"Brush teeth and wash face."
    },
    {
        id:3,
        task:"Do 10 minutes of stretching or yoga"
    },
    {
        id:4,
        task:"Have a balanced breakfast with protein, carbs, and fruits."
    },
];

{!(localStorage.getItem("taskItems")) && setDataLocally(items)}
let taskItems = getDataLocally();


document.querySelector(".header-text").textContent=currentDate();
const listContainer = document.getElementById("list-items");

//code for display list items 

function displayTasks(){
    listContainer.innerHTML="";
    taskItems.forEach((item)=>{
        const divElement = document.createElement('div');
        divElement.classList.add("task-container");
        divElement.classList.add(`edit-${item.id}`);

        const paraElement = document.createElement("p");
        paraElement.classList.add("task-content");
        paraElement.textContent = item.task;

        const deleteElement = document.createElement('span')
        deleteElement.classList.add("task-delete-btn");
        deleteElement.innerHTML="<i class='fa-solid fa-trash'></i>";
        deleteElement.value = item.id;
        
        const editElement = document.createElement('span')
        editElement.classList.add("task-edit-btn");
        editElement.innerHTML="<i class='fa-solid fa-pen-to-square'></i>";
        editElement.value = item.id;

        const iconsElement = document.createElement("div");
        iconsElement.classList.add("delete-edit-icons");
        iconsElement.appendChild(editElement);
        iconsElement.appendChild(deleteElement);


        divElement.appendChild(paraElement);
        divElement.appendChild(iconsElement);
        listContainer.appendChild(divElement);
    });

}

displayTasks();

function setDataLocally(tasks){
    localStorage.setItem("taskItems",JSON.stringify(tasks));
}
function getDataLocally(){
    return JSON.parse(localStorage.getItem("taskItems"));
}


//Add New Task

const addTaskForm = document.querySelector('.form-add-item');
addTaskForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const taskType = e.target.children[1].name;
    const newTaskItem = document.querySelector('.newTask');

    if(taskType === "editTask"){
        const updatedTaskId = document.querySelector('.form-submit-btn').getAttribute('data-index');
        taskItems = taskItems.map((item)=>(
          ( item.id === Number(updatedTaskId)) ? {...item, task: newTaskItem.value}:item
        ))
      

        document.querySelector(".form-submit-btn").name = "";
    
    }else{

        const newTask ={
            id:(taskItems.length === 0)? 1 :(taskItems[taskItems.length - 1].id + 1),
            task:newTaskItem.value
        }
        taskItems.push(newTask);
      
    }
    newTaskItem.value = "";
    setDataLocally(taskItems);
    displayTasks();
    
})

// for task delete and edite
document.querySelector(".list-items").addEventListener("click",(e)=>{

    if(e.path[1].classList.value === "task-delete-btn"){
        const deleteTaskId = e.path[1].value;
        console.log(deleteTaskId)
        taskItems = taskItems.filter((item)=> item.id !== deleteTaskId);
        setDataLocally(taskItems);

    }else if(e.path[1].classList.value === "task-edit-btn"){
        const editTaskId = e.path[1].value;
        const tag = document.querySelector(`.edit-${editTaskId} p`)
        const inputField = document.querySelector(".newTask");
        inputField.value = tag.textContent;
        inputField.focus();
        document.querySelector(".form-submit-btn").name = "editTask";
        document.querySelector(".form-submit-btn").setAttribute('data-index',editTaskId);
    }else{
        return true
    }
    displayTasks();
})

function currentDate(){
    const today = new Date();
    const option = {
        month:"short",
        weekday: "long",
        day:"numeric",
    }
    return today.toLocaleString('en-in',option)
}


// / footer para
const currentYear = new Date().getFullYear()
document.querySelector(".copyright").textContent = `copyrights © ${currentYear} Meganathan`;