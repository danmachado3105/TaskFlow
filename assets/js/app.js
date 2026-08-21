const newTaskButton = document.querySelector("#new-task-button");

const taskFormContainer = document.querySelector(".task-form");

const taskForm = document.querySelector(".task-form form");

const cancelButton = document.querySelector("#cancel-button");

const titleInput = document.querySelector("#title");

const descriptionInput = document.querySelector("#description");

const taskList = document.querySelector(".task-list");

const filterButtons = document.querySelectorAll(".sidebar-button");

const searchInput = document.querySelector("#search-input");

const formTitle = document.querySelector("#form-title");

const emptyState = document.querySelector("#empty-state");

const deleteModal = document.querySelector("#delete-modal");

const cancelDeleteButton = document.querySelector("#cancel-delete");

const confirmDeleteButton = document.querySelector("#confirm-delete");

const toast = document.querySelector("#toast");


let tasks = [];

let editingTaskId = null;

let deletingTaskId = null;

let currentFilter = "all";

let currentSearch = "";


/* ================================
   LOCAL STORAGE
================================ */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


/* ================================
   TOAST
================================ */

function showToast(message) {

    toast.textContent = message;

    toast.classList.remove("hidden");

    setTimeout(function () {

        toast.classList.add("hidden");

    }, 2500);

}


/* ================================
   CRIAR ELEMENTO DA TAREFA
================================ */

function createTaskElement(task) {

    const taskElement = document.createElement("article");

    taskElement.classList.add("task-card");

    taskElement.dataset.id = task.id;


    taskElement.innerHTML = `

        <div class="task-info">

            <h3>${task.title}</h3>

            <p>${task.description}</p>

        </div>


        <div class="task-actions">

            <button
                type="button"
                class="edit-button"
            >
                Editar
            </button>


            <button
                type="button"
                class="favorite-button"
            >
                ☆
            </button>


            <button
                type="button"
                class="primary-button"
            >
                Concluir
            </button>


            <button
                type="button"
                class="delete-button"
            >
                Excluir
            </button>

        </div>
    `;


    if (task.favorite) {

        taskElement.classList.add("favorite");

        taskElement.querySelector(
            ".favorite-button"
        ).textContent = "★";

    }


    if (task.completed) {

        taskElement.classList.add("completed");

        taskElement.querySelector(
            ".primary-button"
        ).textContent = "✓ Concluída";

    }


    return taskElement;

}


/* ================================
   RENDERIZAR TAREFAS
================================ */

function renderTasks() {

    taskList.innerHTML = "";


    const search = currentSearch.toLowerCase();


    const filteredTasks = tasks.filter(function (task) {

        const matchesFilter =
            currentFilter === "all" ||

            (
                currentFilter === "pending" &&
                !task.completed
            ) ||

            (
                currentFilter === "completed" &&
                task.completed
            ) ||

            (
                currentFilter === "favorite" &&
                task.favorite
            );


        const matchesSearch =
            task.title.toLowerCase().includes(search) ||

            task.description.toLowerCase().includes(search);


        return matchesFilter && matchesSearch;

    });


    filteredTasks.forEach(function (task) {

        const taskElement =
            createTaskElement(task);

        taskList.appendChild(taskElement);

    });


    if (filteredTasks.length === 0) {

        emptyState.classList.remove("hidden");

    } else {

        emptyState.classList.add("hidden");

    }

}


/* ================================
   ABRIR FORMULÁRIO
================================ */

newTaskButton.addEventListener(
    "click",
    function () {

        editingTaskId = null;

        formTitle.textContent = "Nova tarefa";

        taskForm.reset();

        taskFormContainer.classList.remove(
            "hidden"
        );

        titleInput.focus();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* ================================
   CANCELAR FORMULÁRIO
================================ */

cancelButton.addEventListener(
    "click",
    function () {

        editingTaskId = null;

        taskForm.reset();

        formTitle.textContent = "Nova tarefa";

        taskFormContainer.classList.add(
            "hidden"
        );

    }
);


/* ================================
   SALVAR / EDITAR TAREFA
================================ */

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const title =
            titleInput.value.trim();

        const description =
            descriptionInput.value.trim();


        if (!title || !description) {

            return;

        }


        /* EDITAR */

        if (editingTaskId !== null) {

            const task = tasks.find(
                function (task) {

                    return task.id === editingTaskId;

                }
            );


            if (task) {

                task.title = title;

                task.description = description;

            }


            saveTasks();

            editingTaskId = null;

            taskForm.reset();

            taskFormContainer.classList.add(
                "hidden"
            );

            renderTasks();

            showToast(
                "Tarefa atualizada com sucesso!"
            );

            return;

        }


        /* CRIAR */

        const task = {

            id: Date.now(),

            title: title,

            description: description,

            completed: false,

            favorite: false

        };


        tasks.push(task);

        saveTasks();


        taskForm.reset();

        taskFormContainer.classList.add(
            "hidden"
        );


        renderTasks();


        showToast(
            "Tarefa criada com sucesso!"
        );

    }
);


/* ================================
   CLIQUES NAS TAREFAS
================================ */

taskList.addEventListener(
    "click",
    function (event) {


        /* EDITAR */

        const editButton =
            event.target.closest(".edit-button");


        if (editButton) {

            const taskElement =
                editButton.closest(".task-card");


            const taskId =
                Number(taskElement.dataset.id);


            const task = tasks.find(
                function (task) {

                    return task.id === taskId;

                }
            );


            if (!task) {

                return;

            }


            editingTaskId = task.id;


            titleInput.value =
                task.title;

            descriptionInput.value =
                task.description;


            formTitle.textContent =
                "Editar tarefa";


            taskFormContainer.classList.remove(
                "hidden"
            );


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });


            titleInput.focus();


            return;

        }


        /* FAVORITAR */

        const favoriteButton =
            event.target.closest(
                ".favorite-button"
            );


        if (favoriteButton) {

            const taskElement =
                favoriteButton.closest(
                    ".task-card"
                );


            const taskId =
                Number(taskElement.dataset.id);


            const task = tasks.find(
                function (task) {

                    return task.id === taskId;

                }
            );


            if (!task) {

                return;

            }


            task.favorite =
                !task.favorite;


            saveTasks();

            renderTasks();


            showToast(
                task.favorite
                    ? "Tarefa adicionada aos favoritos!"
                    : "Tarefa removida dos favoritos!"
            );


            return;

        }


        /* CONCLUIR */

        const completeButton =
            event.target.closest(
                ".primary-button"
            );


        if (completeButton) {

            const taskElement =
                completeButton.closest(
                    ".task-card"
                );


            const taskId =
                Number(taskElement.dataset.id);


            const task = tasks.find(
                function (task) {

                    return task.id === taskId;

                }
            );


            if (!task) {

                return;

            }


            task.completed =
                !task.completed;


            saveTasks();

            renderTasks();


            showToast(
                task.completed
                    ? "Tarefa concluída!"
                    : "Tarefa marcada como pendente!"
            );


            return;

        }


        /* EXCLUIR */

        const deleteButton =
            event.target.closest(
                ".delete-button"
            );


        if (deleteButton) {

            const taskElement =
                deleteButton.closest(
                    ".task-card"
                );


            deletingTaskId =
                Number(taskElement.dataset.id);


            deleteModal.classList.remove(
                "hidden"
            );


            return;

        }

    }
);


/* ================================
   CONFIRMAR EXCLUSÃO
================================ */

confirmDeleteButton.addEventListener(
    "click",
    function () {

        if (deletingTaskId === null) {

            return;

        }


        tasks = tasks.filter(
            function (task) {

                return task.id !== deletingTaskId;

            }
        );


        saveTasks();


        deletingTaskId = null;


        deleteModal.classList.add(
            "hidden"
        );


        renderTasks();


        showToast(
            "Tarefa excluída com sucesso!"
        );

    }
);


/* ================================
   CANCELAR EXCLUSÃO
================================ */

cancelDeleteButton.addEventListener(
    "click",
    function () {

        deletingTaskId = null;

        deleteModal.classList.add(
            "hidden"
        );

    }
);


/* ================================
   FILTROS
================================ */

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                currentFilter =
                    button.dataset.filter;


                filterButtons.forEach(
                    function (button) {

                        button.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                renderTasks();

            }
        );

    }
);


/* ================================
   PESQUISA
================================ */

searchInput.addEventListener(
    "input",
    function () {

        currentSearch =
            searchInput.value.trim();


        renderTasks();

    }
);


/* ================================
   FECHAR MODAL CLICANDO FORA
================================ */

deleteModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === deleteModal
        ) {

            deletingTaskId = null;

            deleteModal.classList.add(
                "hidden"
            );

        }

    }
);


/* ================================
   CARREGAR LOCAL STORAGE
================================ */

const savedTasks =
    localStorage.getItem("tasks");


if (savedTasks) {

    try {

        tasks = JSON.parse(savedTasks);

    } catch (error) {

        console.error(
            "Erro ao carregar tarefas:",
            error
        );

        tasks = [];

    }

}


/* ================================
   INICIALIZAR
================================ */

renderTasks();