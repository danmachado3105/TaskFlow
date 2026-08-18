const newTaskButton = document.querySelector("#new-task-button");
const taskFormContainer = document.querySelector(".task-form");
const taskForm = document.querySelector(".task-form form");
const cancelButton = document.querySelector("#cancel-button");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const taskList = document.querySelector(".task-list");
const filterButtons = document.querySelectorAll(".sidebar-button");

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
        <div class="task-info">
            <h3>${titleInput.value}</h3>
            <p>${descriptionInput.value}</p>
        </div>

        <button class="primary-button">Concluir</button>
    `;

    taskList.appendChild(taskElement);
});


taskList.addEventListener("click", function (event) {
    const completeButton = event.target.closest(".primary-button");

    if (!completeButton) {
        return;
    }

    const taskElement = completeButton.closest(".task-card");

    taskElement.classList.add("completed");

    console.log("Tarefa concluída!");
});

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {

        const filter = button.dataset.filter;

        const tasks = taskList.querySelectorAll(".task-card");

        tasks.forEach(function (task) {

            if (filter === "all") {
                task.style.display = "flex";
            }

            if (filter === "pending") {
                if (task.classList.contains("completed")) {
                    task.style.display = "none";
                } else {
                    task.style.display = "flex";
                }
            }

            if (filter === "completed") {
                if (task.classList.contains("completed")) {
                    task.style.display = "flex";
                } else {
                    task.style.display = "none";
                }
            }

        });

    });
});