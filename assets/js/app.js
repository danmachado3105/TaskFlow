const newTaskButton = document.querySelector("#new-task-button");
const taskForm = document.querySelector(".task-form");
const cancelButton = document.querySelector("#cancel-button");

newTaskButton.addEventListener("click", function () {
    taskForm.classList.remove("hidden");
});

cancelButton.addEventListener("click", function () {
    taskForm.classList.add("hidden");
});