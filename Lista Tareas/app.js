// Obtener elementos del DOM
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search');

// Array para almacenar las tareas
let tasks = [];

// Función para guardar las tareas en localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Función para renderizar las tareas en la lista
function renderTasks(filteredTasks = tasks) {
    taskList.innerHTML = '';
    filteredTasks.forEach((task, filteredIndex) => {
        const taskIndex = tasks.indexOf(task);
        const taskItem = document.createElement('div');
        taskItem.className = 'card';

        let taskColorClass = '';
        if (task.completed) {
            taskColorClass = 'bg-success';
        } else if (new Date(task.dueDate) < new Date()) {
            taskColorClass = 'bg-danger';
        }

        taskItem.innerHTML = `
            <div class="card-body ${taskColorClass}">
                <h5 class="card-title">${task.name}</h5>
                <p class="card-text">Inicio: ${task.startDate}</p>
                <p class="card-text">Fin: ${task.dueDate}</p>
                <p class="card-text">Responsable: ${task.assignee}</p>
                <div class="btn-container">
                    <button class="btn btn-outline-success btn-sm" onclick="toggleComplete(${taskIndex})">
                        ${task.completed ? 'Desmarcar' : 'Resuelta'}
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="confirmDelete(${taskIndex})">Eliminar</button>
                </div>
            </div>
        `;

        taskList.appendChild(taskItem);
    });
}

// Función para añadir una tarea
function addTask(name, startDate, dueDate, assignee) {
    tasks.push({
        name,
        startDate,
        dueDate,
        assignee,
        completed: false
    });
    saveTasks();
    renderAllTasks();
}

// Función para marcar o desmarcar una tarea como completada
function toggleComplete(index) {
    const task = tasks[index];
    if (task.completed) {
        task.completed = false;
    } else if (new Date(task.dueDate) < new Date()) {
        alert('No se puede marcar como resuelta una tarea que ya expiró.');
        return;
    } else {
        task.completed = true;
    }
    saveTasks();
    renderAllTasks();
}

// Función para eliminar una tarea
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderAllTasks();
}

// Función para confirmar antes de eliminar una tarea
function confirmDelete(index) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        deleteTask(index);
    }
}

// Función para buscar tareas
function searchTasks() {
    const query = searchInput.value.toLowerCase();
    const filteredTasks = tasks.filter(task => {
        const taskName = task.name.toLowerCase();
        const taskAssignee = task.assignee.toLowerCase();
        return taskName.includes(query) || taskAssignee.includes(query);
    });
    renderTasks(filteredTasks);
}

// Función para filtrar tareas
function filterTasks(filter) {
    let filteredTasks;
    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'overdue') {
        filteredTasks = tasks.filter(task => !task.completed && new Date(task.dueDate) < new Date());
    } else {
        filteredTasks = tasks;
    }
    renderTasks(filteredTasks);
}

// Función para mostrar todas las tareas y limpiar el texto de búsqueda
function renderAllTasks() {
    searchInput.value = '';
    renderTasks(tasks);
}

// Manejador de envío del formulario de tarea
taskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const startDate = document.getElementById('start-date').value;
    const dueDate = document.getElementById('due-date').value;
    const assignee = document.getElementById('assignee').value;

    if (new Date(dueDate) < new Date(startDate)) {
        alert('La fecha de fin no puede ser anterior a la fecha de inicio.');
        return;
    }

    addTask(taskName, startDate, dueDate, assignee);

    // Limpiar el formulario después de agregar la tarea
    taskForm.reset();
    renderAllTasks();
});

// Cargar tareas desde localStorage al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        tasks = storedTasks;
        renderAllTasks();
    }
});

// Limpiar el campo de búsqueda y mostrar todas las tareas al cambiar
searchInput.addEventListener('input', function() {
    if (searchInput.value === '') {
        renderAllTasks();
    }
});
