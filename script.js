// Load tasks from local storage
document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('weeklyTasks')) || {};

    Object.keys(savedTasks).forEach((dayId) => {
        const daySection = document.getElementById(dayId);
        const taskList = daySection.querySelector('.task-list');
        const favoriteList = daySection.querySelector('.favorite-tasks');

        // Render tasks
        savedTasks[dayId].tasks.forEach((task) => {
            const taskItem = createTaskItem(task.text, false, dayId);
            taskList.appendChild(taskItem);
        });

        // Render favorite tasks
        savedTasks[dayId].favorites.forEach((task) => {
            const favoriteItem = createTaskItem(task.text, true, dayId);
            favoriteList.appendChild(favoriteItem);
        });
    });
}


function saveTasks() {
    const allDays = document.querySelectorAll('.day');
    const taskData = {};

    allDays.forEach((day) => {
        const dayId = day.id;

        // Extract plain text content for tasks and favorites
        const tasks = Array.from(day.querySelectorAll('.task-list li')).map((li) => ({
            text: li.firstChild.textContent.trim(), // Get only the task text
        }));

        const favorites = Array.from(day.querySelectorAll('.favorite-tasks li')).map((li) => ({
            text: li.firstChild.textContent.trim(), // Get only the favorite task text
        }));

        taskData[dayId] = { tasks, favorites };
    });

    // Save updated task data to localStorage
    localStorage.setItem('weeklyTasks', JSON.stringify(taskData));
}


function createTaskItem(taskText, isFavorite, dayId) {
    const taskItem = document.createElement('li');
    const list = isFavorite
        ? document.getElementById(dayId).querySelector('.favorite-tasks')
        : document.getElementById(dayId).querySelector('.task-list');

    taskItem.innerHTML = `
        ${taskText}
        ${isFavorite ? '' : '<button class="important-btn">★</button>'}
        <button class="remove-btn">Remove</button>
    `;

    // Mark task as important
    if (!isFavorite) {
        taskItem.querySelector('.important-btn').addEventListener('click', () => {
            const favoriteList = document.getElementById(dayId).querySelector('.favorite-tasks');
            const favoriteItem = createTaskItem(taskText, true, dayId);
            favoriteList.appendChild(favoriteItem);

            taskItem.remove();
            saveTasks();
        });
    }

    // Remove task
    taskItem.querySelector('.remove-btn').addEventListener('click', () => {
        if (isFavorite) {
            // Remove from favorites only
            const favoriteList = document.getElementById(dayId).querySelector('.favorite-tasks');
            favoriteList.removeChild(taskItem);
        } else {
            // Remove from task list
            const taskList = document.getElementById(dayId).querySelector('.task-list');
            taskList.removeChild(taskItem);
        }
        saveTasks();
    });

    return taskItem;
}

// Add functionality to handle tasks
document.querySelectorAll('.add-task-btn').forEach((button) => {
    button.addEventListener('click', (e) => {
        const parent = e.target.closest('.day');
        const taskInput = parent.querySelector('.task-field');
        const taskList = parent.querySelector('.task-list');

        const taskText = taskInput.value.trim();

        if (taskText) {
            const taskItem = createTaskItem(taskText, false, parent.id);
            taskList.appendChild(taskItem);
            taskInput.value = '';
            saveTasks();
        }
    });
});
