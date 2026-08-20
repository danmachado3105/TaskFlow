const newTaskButton = document.querySelector("#new-task-button");
const taskFormContainer = document.querySelector(".task-form");
const taskForm = document.querySelector(".task-form form");
const cancelButton = document.querySelector("#cancel-button");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const taskList = document.querySelector(".task-list");
const filterButtons = document.querySelectorAll(".sidebar-button");

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

newTaskButton.addEventListener("click", function () {
    editingTaskId = null;

    taskForm.reset();

    taskFormContainer.classList.remove("hidden");
});

cancelButton.addEventListener("click", function () {
    taskFormContainer.classList.add("hidden");
});

let tasks = [];

let editingTaskId = null;

function createTaskElement(task) {
    const taskElement = document.createElement("div");

    taskElement.classList.add("task-card");
    taskElement.dataset.id = task.id;

    taskElement.innerHTML = `
        <div class="task-info">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
        </div>

        <div class="task-actions">
            <button type="button" class="edit-button">Editar</button>
            <button type="button" class="favorite-button">☆</button>
            <button type="button" class="primary-button">Concluir</button>
            <button type="button" class="delete-button">Excluir</button>
        </div>
    `;

    if (task.favorite) {
        taskElement.classList.add("favorite");
        taskElement.querySelector(".favorite-button").textContent = "★";
    }

    if (task.completed) {
        taskElement.classList.add("completed");
        taskElement.querySelector(".primary-button").textContent = "✓ Concluída";
    }

    return taskElement;
}

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (editingTaskId !== null) {

        const task = tasks.find(function (task) {
            return task.id === editingTaskId;
        });

        task.title = titleInput.value;
        task.description = descriptionInput.value;

        saveTasks();

        const taskElement = taskList.querySelector(
            `.task-card[data-id="${editingTaskId}"]`
        );

        taskElement.querySelector("h3").textContent = task.title;
        taskElement.querySelector("p").textContent = task.description;

        editingTaskId = null;

    } else {

        const task = {
            id: Date.now(),
            title: titleInput.value,
            description: descriptionInput.value,
            completed: false,
            favorite: false
        };

        tasks.push(task);

        saveTasks();

        const taskElement = createTaskElement(task);

        taskList.appendChild(taskElement);
    }

    taskForm.reset();
    taskFormContainer.classList.add("hidden");
});

taskList.addEventListener("click", function (event) {

    const deleteButton = event.target.closest(".delete-button");

    if (deleteButton) {
        const taskElement = deleteButton.closest(".task-card");

        const taskId = Number(taskElement.dataset.id);

        tasks = tasks.filter(function (task) {
            return task.id !== taskId;
        });

        saveTasks();

        taskElement.remove();

        return;
    }

    const editButton = event.target.closest(".edit-button");

    if (editButton) {
        const taskElement = editButton.closest(".task-card");

        const taskId = Number(taskElement.dataset.id);

        const task = tasks.find(function (task) {
            return task.id === taskId;
        });

        editingTaskId = task.id;

        titleInput.value = task.title;
        descriptionInput.value = task.description;

        taskFormContainer.classList.remove("hidden");

        taskFormContainer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        console.log("Editando:", task);

        return;
    }

    const favoriteButton = event.target.closest(".favorite-button");

    if (favoriteButton) {
        const taskElement = favoriteButton.closest(".task-card");

        const taskId = Number(taskElement.dataset.id);

        const task = tasks.find(function (task) {
            return task.id === taskId;
        });

        taskElement.classList.toggle("favorite");

        task.favorite = taskElement.classList.contains("favorite");

        if (taskElement.classList.contains("favorite")) {
            favoriteButton.textContent = "★";
        } else {
            favoriteButton.textContent = "☆";
        }

        saveTasks();

        return;
    }

    const completeButton = event.target.closest(".primary-button");

    if (completeButton) {
        const taskElement = completeButton.closest(".task-card");

        const taskId = Number(taskElement.dataset.id);

        const task = tasks.find(function (task) {
            return task.id === taskId;
        });

        taskElement.classList.toggle("completed");

        task.completed = taskElement.classList.contains("completed");

        if (taskElement.classList.contains("completed")) {
            completeButton.textContent = "✓ Concluída";
        } else {
            completeButton.textContent = "Concluir";
        }

        saveTasks();
    }
});

function filterTasks(filter) {
    const tasks = taskList.querySelectorAll(".task-card");

    tasks.forEach(function (task) {

        if (filter === "all") {
            task.classList.remove("hidden");
        }

        if (filter === "pending") {
            if (task.classList.contains("completed")) {
                task.classList.add("hidden");
            } else {
                task.classList.remove("hidden");
            }
        }

        if (filter === "completed") {
            if (task.classList.contains("completed")) {
                task.classList.remove("hidden");
            } else {
                task.classList.add("hidden");
            }
        }

        if (filter === "favorite") {
            if (task.classList.contains("favorite")) {
                task.classList.remove("hidden");
            } else {
                task.classList.add("hidden");
            }
        }

    });
}

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {

        const filter = button.dataset.filter;

        filterButtons.forEach(function (button) {
            button.classList.remove("active");
        });

        button.classList.add("active");

        filterTasks(filter);
    });
});

const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
    tasks = JSON.parse(savedTasks);

    console.log(tasks);
}

tasks.forEach(function (task) {
    const taskElement = createTaskElement(task);

    taskList.appendChild(taskElement);
});