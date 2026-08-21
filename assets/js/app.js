const newTaskButton =
    document.querySelector("#new-task-button");

const taskFormContainer =
    document.querySelector("#task-form-container");

const taskForm =
    document.querySelector("#task-form");

const cancelButton =
    document.querySelector("#cancel-button");

const titleInput =
    document.querySelector("#title");

const descriptionInput =
    document.querySelector("#description");

const taskList =
    document.querySelector("#task-list");

const filterButtons =
    document.querySelectorAll(".sidebar-button");

const searchInput =
    document.querySelector("#search-input");

const formTitle =
    document.querySelector("#form-title");

const emptyState =
    document.querySelector("#empty-state");

const emptyTitle =
    document.querySelector("#empty-title");

const emptyDescription =
    document.querySelector("#empty-description");

const deleteModal =
    document.querySelector("#delete-modal");

const cancelDeleteButton =
    document.querySelector("#cancel-delete");

const confirmDeleteButton =
    document.querySelector("#confirm-delete");

const toast =
    document.querySelector("#toast");

const totalCount =
    document.querySelector("#total-count");

const pendingCount =
    document.querySelector("#pending-count");

const completedCount =
    document.querySelector("#completed-count");

const favoriteCount =
    document.querySelector("#favorite-count");

const progressPercentage =
    document.querySelector("#progress-percentage");

const progressFill =
    document.querySelector("#progress-fill");

const progressText =
    document.querySelector("#progress-text");

const resultsCount =
    document.querySelector("#results-count");


let tasks = [];

let editingTaskId = null;

let deletingTaskId = null;

let currentFilter = "all";

let currentSearch = "";

let toastTimeout;


/* =========================
   LOCAL STORAGE
========================= */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


/* =========================
   TOAST
========================= */

function showToast(message) {

    clearTimeout(toastTimeout);

    toast.textContent = message;

    toast.classList.remove("hidden");

    toastTimeout = setTimeout(
        function () {

            toast.classList.add(
                "hidden"
            );

        },
        2500
    );

}


/* =========================
   CRIAR TASK ELEMENT
========================= */

function createTaskElement(task) {

    const taskElement =
        document.createElement("article");


    taskElement.classList.add(
        "task-card"
    );


    taskElement.dataset.id =
        task.id;


    taskElement.innerHTML = `

        <div class="task-info">

            <h3></h3>

            <p></p>

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
                aria-label="Favoritar tarefa"
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


    taskElement.querySelector(
        "h3"
    ).textContent =
        task.title;


    taskElement.querySelector(
        "p"
    ).textContent =
        task.description;


    const favoriteButton =
        taskElement.querySelector(
            ".favorite-button"
        );


    const completeButton =
        taskElement.querySelector(
            ".primary-button"
        );


    if (task.favorite) {

        taskElement.classList.add(
            "favorite"
        );

        favoriteButton.textContent =
            "★";

    }


    if (task.completed) {

        taskElement.classList.add(
            "completed"
        );

        completeButton.textContent =
            "✓ Concluída";

    }


    return taskElement;

}


/* =========================
   DASHBOARD
========================= */

function updateDashboard() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function (task) {

                return task.completed;

            }
        ).length;


    const pending =
        total - completed;


    const favorites =
        tasks.filter(
            function (task) {

                return task.favorite;

            }
        ).length;


    const progress =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    totalCount.textContent =
        total;


    pendingCount.textContent =
        pending;


    completedCount.textContent =
        completed;


    favoriteCount.textContent =
        favorites;


    progressPercentage.textContent =
        `${progress}%`;


    progressFill.style.width =
        `${progress}%`;


    if (total === 0) {

        progressText.textContent =
            "Nenhuma tarefa criada ainda.";

    } else if (progress === 100) {

        progressText.textContent =
            "Parabéns! Todas as tarefas foram concluídas.";

    } else {

        progressText.textContent =
            `${completed} de ${total} tarefas concluídas.`;

    }

}


/* =========================
   FILTRAR TAREFAS
========================= */

function getFilteredTasks() {

    const search =
        currentSearch.toLowerCase();


    return tasks.filter(
        function (task) {


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
                task.title
                    .toLowerCase()
                    .includes(search) ||

                task.description
                    .toLowerCase()
                    .includes(search);


            return (
                matchesFilter &&
                matchesSearch
            );

        }
    );

}


/* =========================
   EMPTY STATE
========================= */

function updateEmptyState(
    filteredTasks
) {

    if (filteredTasks.length > 0) {

        emptyState.classList.add(
            "hidden"
        );

        return;

    }


    emptyState.classList.remove(
        "hidden"
    );


    if (
        currentSearch ||
        currentFilter !== "all"
    ) {

        emptyTitle.textContent =
            "Nenhuma tarefa encontrada";

        emptyDescription.textContent =
            "Tente mudar a pesquisa ou o filtro.";

    } else {

        emptyTitle.textContent =
            "Nenhuma tarefa ainda";

        emptyDescription.textContent =
            "Crie sua primeira tarefa para começar.";

    }

}


/* =========================
   RENDER
========================= */

function renderTasks() {

    taskList.innerHTML = "";


    const filteredTasks =
        getFilteredTasks();


    filteredTasks.forEach(
        function (task) {

            taskList.appendChild(
                createTaskElement(task)
            );

        }
    );


    updateDashboard();

    updateEmptyState(
        filteredTasks
    );


    const count =
        filteredTasks.length;


    resultsCount.textContent =
        count === 1
            ? "1 tarefa"
            : `${count} tarefas`;

}


/* =========================
   ABRIR NOVA TAREFA
========================= */

newTaskButton.addEventListener(
    "click",
    function () {

        editingTaskId = null;

        formTitle.textContent =
            "Nova tarefa";

        taskForm.reset();

        taskFormContainer.classList.remove(
            "hidden"
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        setTimeout(
            function () {

                titleInput.focus();

            },
            150
        );

    }
);


/* =========================
   CANCELAR FORMULÁRIO
========================= */

cancelButton.addEventListener(
    "click",
    function () {

        editingTaskId = null;

        taskForm.reset();

        formTitle.textContent =
            "Nova tarefa";

        taskFormContainer.classList.add(
            "hidden"
        );

    }
);


/* =========================
   SUBMIT
========================= */

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const title =
            titleInput.value.trim();


        const description =
            descriptionInput.value.trim();


        if (
            !title ||
            !description
        ) {

            return;

        }


        /* EDITAR */

        if (
            editingTaskId !== null
        ) {

            const task =
                tasks.find(
                    function (task) {

                        return (
                            task.id ===
                            editingTaskId
                        );

                    }
                );


            if (task) {

                task.title =
                    title;

                task.description =
                    description;

            }


            saveTasks();


            editingTaskId =
                null;


            taskForm.reset();


            formTitle.textContent =
                "Nova tarefa";


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

            id:
                Date.now(),

            title:
                title,

            description:
                description,

            completed:
                false,

            favorite:
                false

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


/* =========================
   CLIQUES NAS TAREFAS
========================= */

taskList.addEventListener(
    "click",
    function (event) {


        /* EDITAR */

        const editButton =
            event.target.closest(
                ".edit-button"
            );


        if (editButton) {

            const taskElement =
                editButton.closest(
                    ".task-card"
                );


            const taskId =
                Number(
                    taskElement.dataset.id
                );


            const task =
                tasks.find(
                    function (task) {

                        return (
                            task.id ===
                            taskId
                        );

                    }
                );


            if (!task) {

                return;

            }


            editingTaskId =
                task.id;


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


            setTimeout(
                function () {

                    titleInput.focus();

                },
                150
            );


            return;

        }


        /* FAVORITO */

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
                Number(
                    taskElement.dataset.id
                );


            const task =
                tasks.find(
                    function (task) {

                        return (
                            task.id ===
                            taskId
                        );

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
                    ? "Adicionada aos favoritos!"
                    : "Removida dos favoritos!"
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
                Number(
                    taskElement.dataset.id
                );


            const task =
                tasks.find(
                    function (task) {

                        return (
                            task.id ===
                            taskId
                        );

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
                    : "Tarefa voltou para pendentes!"
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
                Number(
                    taskElement.dataset.id
                );


            deleteModal.classList.remove(
                "hidden"
            );


            return;

        }

    }
);


/* =========================
   CONFIRMAR EXCLUSÃO
========================= */

confirmDeleteButton.addEventListener(
    "click",
    function () {

        if (
            deletingTaskId === null
        ) {

            return;

        }


        tasks =
            tasks.filter(
                function (task) {

                    return (
                        task.id !==
                        deletingTaskId
                    );

                }
            );


        saveTasks();


        deletingTaskId =
            null;


        deleteModal.classList.add(
            "hidden"
        );


        renderTasks();


        showToast(
            "Tarefa excluída com sucesso!"
        );

    }
);


/* =========================
   CANCELAR EXCLUSÃO
========================= */

cancelDeleteButton.addEventListener(
    "click",
    function () {

        deletingTaskId =
            null;


        deleteModal.classList.add(
            "hidden"
        );

    }
);


/* =========================
   CLICAR FORA DO MODAL
========================= */

deleteModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            deleteModal
        ) {

            deletingTaskId =
                null;


            deleteModal.classList.add(
                "hidden"
            );

        }

    }
);


/* =========================
   ESC FECHA MODAL
========================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            !deleteModal.classList.contains(
                "hidden"
            )
        ) {

            deletingTaskId =
                null;


            deleteModal.classList.add(
                "hidden"
            );

        }

    }
);


/* =========================
   FILTROS
========================= */

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


/* =========================
   PESQUISA
========================= */

searchInput.addEventListener(
    "input",
    function () {

        currentSearch =
            searchInput.value.trim();


        renderTasks();

    }
);


/* =========================
   LOCAL STORAGE
========================= */

const savedTasks =
    localStorage.getItem("tasks");


if (savedTasks) {

    try {

        const parsedTasks =
            JSON.parse(savedTasks);


        if (
            Array.isArray(parsedTasks)
        ) {

            tasks =
                parsedTasks;

        }

    } catch (error) {

        console.error(
            "Erro ao carregar tarefas:",
            error
        );

        tasks = [];

    }

}


/* =========================
   INICIALIZAÇÃO
========================= */

renderTasks();