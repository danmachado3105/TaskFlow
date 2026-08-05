const newTaskButton = document.querySelector("#new-task-button");

console.log(newTaskButton);

const taskForm = document.querySelector(".task-form");

newTaskButton.addEventListener("click", function () {
    taskForm.classList.remove("hidden");
});

const cancelButton = document.querySelector("cancel-button")

console.log(cancelButton)

cancelButton.addEventListener("click", function () {
    taskForm.classList.add("hidden");
});