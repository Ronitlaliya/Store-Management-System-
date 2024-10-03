const openingUsername = 'opening';
const openingPassword = 'password123';
const closingUsername = 'closing';
const closingPassword = 'password321';
const logViewerUsername = 'owner';
const logViewerPassword = 'ronit';

let currentUser;
let currentStaffType;
let taskIndex = 0;
let logs = JSON.parse(localStorage.getItem('logs')) || [];

// Function to handle staff login
function login() {
    const fullName = document.getElementById('full-name').value.trim();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    currentStaffType = document.querySelector('input[name="staff-type"]:checked').value;

    if ((username === openingUsername && password === openingPassword) || 
        (username === closingUsername && password === closingPassword)) {
        currentUser = fullName;
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('checklist-page').classList.remove('hidden');
        showChecklist(currentStaffType);
    } else {
        errorDiv.textContent = 'Sach Sach bata kon hai or kya lene aya hai';
    }
}

// Function to handle log viewer login
function logLogin() {
    const username = document.getElementById('log-username').value;
    const password = document.getElementById('log-password').value;
    const errorDiv = document.getElementById('log-login-error');

    if (username === logViewerUsername && password === logViewerPassword) {
        document.getElementById('log-login-page').classList.add('hidden');
        showLogs();
    } else {
        errorDiv.textContent = 'Invalid username or password';
    }
}

// Function to load checklist tasks based on staff type
function showChecklist(staffType) {
    const tasksContainer = document.getElementById('tasks');
    tasksContainer.innerHTML = '';
    const submitButton = document.getElementById('submit-button');
    submitButton.classList.add('hidden');

    let tasks;
    if (staffType === 'closing') {
        tasks = [
            'Switch off all air conditioning',
            'Make sure all crockery is washed',
            'Clean up',
            'Cash register reconcilition',
            'Check all lights are off',
            'Verify all doors are locked',
            'Check alarm system is activated',
            'Final walkthrough',
            'Check Every important things we have or not for tomorrow, If not write a note and stik it on door'
        ];
    } else if (staffType === 'opening') {
        tasks = [
            'Check closing staff\'s notes (if any)',
            'Food and Beverages preparation',
            'Setup the store properly.',
            'Make Sure there is no dust on any product',
            'Call every staff member who is not there till now.'
        ];
    }

    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.innerHTML = `<input type="checkbox" disabled> ${task} <span class="countdown hidden">15s</span>`;
        tasksContainer.appendChild(taskElement);
    });

    taskIndex = 0;
    enableNextTask();
}

// Function to enable the next task after countdown
function enableNextTask() {
    const tasks = document.querySelectorAll('#tasks input[type="checkbox"]');
    const countdowns = document.querySelectorAll('#tasks .countdown');

    if (taskIndex < tasks.length) {
        tasks[taskIndex].disabled = false;
        tasks[taskIndex].addEventListener('change', function() {
            const timestamp = new Date().toLocaleString();
            logs.push({
                fullName: currentUser,
                task: this.nextSibling.textContent.trim(),
                timestamp: timestamp
            });
            localStorage.setItem('logs', JSON.stringify(logs));
            this.disabled = true;
            countdowns[taskIndex].classList.remove('hidden');
            let timeLeft = 15;
            const interval = setInterval(() => {
                timeLeft--;
                countdowns[taskIndex].textContent = `${timeLeft}s`;
                if (timeLeft <= 0) {
                    clearInterval(interval);
                    countdowns[taskIndex].classList.add('hidden');
                    taskIndex++;
                    enableNextTask();
                }
            }, 1000);
        });
    } else {
        document.getElementById('submit-button').classList.remove('hidden');
    }
}

// Function to handle checklist submission
function submitChecklist() {
    document.getElementById('checklist-page').classList.add('hidden');
    document.getElementById('thank-you-page').classList.remove('hidden');
    const thankYouMessage = document.querySelector('.thank-you-message');
    if (currentStaffType === 'closing') {
        thankYouMessage.textContent = 'Thank you, Hope you had a great day.';
    } else if (currentStaffType === 'opening') {
        thankYouMessage.textContent = 'Thank you, Hope you have a good day.';
    }
}

// Function to show logs
function showLogs() {
    const logEntries = document.getElementById('log-entries');
    logEntries.innerHTML = '';
    logs.forEach(log => {
        const logElement = document.createElement('div');
        logElement.innerHTML = `<strong>${log.fullName}</strong> checked <em>${log.task}</em> on ${log.timestamp}`;
        logEntries.appendChild(logElement);
    });
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('log-page').classList.remove('hidden');
}

// Function to go back to login
function goBackToLogin() {
    document.getElementById('log-page').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
}

// Function to show log viewer login
function showLogLogin() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('log-login-page').classList.remove('hidden');
}
// Function to clear logs from local storage and update UI
function clearLogs() {
    localStorage.removeItem('logs'); // Ensure this key matches the one used to store logs
    alert('Logs cleared!');
    updateLogDisplay(); // Update the UI to reflect the cleared logs
}

// Function to update the log display
function updateLogDisplay() {
    const logDisplay = document.getElementById('log-display');
    logDisplay.innerHTML = ''; // Clear the log display
}

// Initial call to update log display on page load
window.onload = updateLogDisplay;
