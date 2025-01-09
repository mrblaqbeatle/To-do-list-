// Load tasks from local storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskList = document.getElementById('task-list');

  tasks.forEach(task => {
    addTaskToList(task.text, task.category, task.important, task.completed);
  });
}

// Save tasks to local storage
function saveTasks() {
  const taskList = document.getElementById('task-list');
  const tasks = Array.from(taskList.children).map(li => ({
    text: li.querySelector('.task-text').textContent,
    category: li.dataset.category,
    important: li.classList.contains('important'),
    completed: li.classList.contains('completed')
  }));
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add task to the list
function addTaskToList(taskText, category, important = false, completed = false) {
  const taskList = document.getElementById('task-list');

  const li = document.createElement('li');
  li.dataset.category = category;
  if (important) li.classList.add('important');
  if (completed) li.classList.add('completed');

  const taskTextSpan = document.createElement('span');
  taskTextSpan.textContent = taskText;
  taskTextSpan.classList.add('task-text');
  taskTextSpan.contentEditable = true;
  taskTextSpan.addEventListener('input', saveTasks);

  const importantButton = document.createElement('button');
  importantButton.textContent = '!';
  importantButton.classList.add('important');
  importantButton.addEventListener('click', function() {
    li.classList.toggle('important');
    saveTasks();
  });

  const completeButton = document.createElement('button');
  completeButton.textContent = '✔';
  completeButton.classList.add('completed');
  completeButton.addEventListener('click', function() {
    li.classList.toggle('completed');
    saveTasks();
  });

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete');
  deleteButton.addEventListener('click', function() {
    taskList.removeChild(li);
    saveTasks();
  });

  li.appendChild(taskTextSpan);
  li.appendChild(importantButton);
  li.appendChild(completeButton);
  li.appendChild(deleteButton);
  taskList.appendChild(li);
}

// Add task event
document.getElementById('add-task').addEventListener('click', function() {
  const taskInput = document.getElementById('new-task');
  const taskText = taskInput.value.trim();
  const taskCategory = document.getElementById('task-category').value;

  if (taskText !== '') {
    addTaskToList(taskText, taskCategory);
    taskInput.value = '';
    saveTasks();
  }
});

// Search tasks
document.getElementById('search-task').addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();
  const taskList = document.getElementById('task-list');
  Array.from(taskList.children).forEach(li => {
    const taskText = li.querySelector('.task-text').textContent.toLowerCase();
    li.style.display = taskText.includes(searchTerm) ? '' : 'none';
  });
});

// Load tasks when the page loads
window.addEventListener('load', loadTasks);

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.log('Service Worker registration failed:', error);
    });
}