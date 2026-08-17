const newTaskButton = document.querySelector("#new-task-button");
const taskFormContainer = document.querySelector(".task-form");
const taskForm = document.querySelector(".task-form form");
const cancelButton = document.querySelector("#cancel-button");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const taskList = document.querySelector(".task-list");

newTaskButton.addEventListener("click", function () {
    taskFormContainer.classList.remove("hidden");
});

cancelButton.addEventListener("click", function () {
    taskFormContainer.classList.add("hidden");
});

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskElement = document.createElement("div");

    taskElement.classList.add("task-card");

    taskElement.innerHTML = `
        <h3> ${titleInput.value} </h3>
        <p> ${descriptionInput.value} </p>
    `;

    taskList.appendChild(taskElement);

    console.log(taskElement);
});
