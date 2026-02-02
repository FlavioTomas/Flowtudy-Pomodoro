/**
 * @file script.js
 * @description Main JavaScript file for the Flowtudy Pomodoro application.
 * @author Flávio Tomás Peña Villa
 * @version 2.2
 *
 * -------------------------------------------------------------------------- *
 *
 * PROJECT: Flowtudy
 * DESCRIPTION: A multi-language Pomodoro timer with task management, built
 *              with a multi-page architecture for optimal SEO and performance.
 *
 * KEY FEATURES:
 * - Separate HTML files for each language (en, pt-BR, es).
 * - JavaScript handles dynamic UI text and user interactions.
 * - All settings and tasks are saved to localStorage.
 *
 * -------------------------------------------------------------------------- *
 *
 * TABLE OF CONTENTS:
 * 1. VARIABLE DECLARATIONS
 * 2. UI STRINGS OBJECT (for dynamic text)
 * 3. THEME & UI FUNCTIONS
 * 4. TIMER LOGIC & STATE MANAGEMENT
 * 5. SETTINGS PANEL & NOTIFICATIONS
 * 6. TASKS SECTION LOGIC
 * 7. LANGUAGE & NAVIGATION
 * 8. INITIALIZATION ON PAGE LOAD
 *
 */




// ==========================================================================
// 1. VARIABLE DECLARATIONS
// ==========================================================================



// Selects all necessary DOM elements for manipulation.
const focusButton = document.querySelector('.js-focus-button');
const breakButton = document.querySelector('.js-break-button');
const longBreakButton = document.querySelector('.js-long-break-button');
const timerModesButtons = document.querySelectorAll('.button--time-mode');
const mainContainer = document.querySelector('.main-container');
const timerDisplay = document.querySelector('.js-timer-display');
const darkModeToggle = document.querySelector('.js-dark-mode-toggle');
const playPauseButton = document.querySelector('.js-play-pause-button');
const resetButton = document.querySelector('.js-reset-button');
const skipButton = document.querySelector('.js-skip-button');
const settingsButton = document.querySelector('.js-settings-button');
const settingsForm = document.querySelector('.js-settings');
const usersFocusTime = document.querySelector('.js-settings__numbers-input--focus');
const usersBreakTime = document.querySelector('.js-settings__numbers-input--break');
const usersLongBreakTime = document.querySelector('.js-settings__numbers-input--long-break');
const usersLongBreakInterval = document.querySelector('.js-settings__options--long-break-interval');
const showLongBreakInterval = document.querySelector('.js-settings__options--long-break-interval--text');
const breaksAutoStartInput = document.querySelector('.js-settings__options--breaks-auto-starts-input');
const focusAutoStartInput = document.querySelector('.js-settings__options--focus-auto-start-input');
const soundNotificationInput = document.querySelector('.js-settings__notifications--sound-switch-input');
const soundNotification = document.getElementById('sound-notification');
const popUpInput = document.querySelector('.js-settings__notifications--pop-up-switch-input');
const tasksSettingsButton = document.querySelector('.js-task-options-button');
const tasksSettingsForm = document.querySelector('.js-task-settings');
const addTaskButton = document.querySelector('.js-add-task-button');
const tasksContainer = document.querySelector('.tasks__display');
const taskCreationForm = document.querySelector('.js-tasks__display-create');
const taskInput = document.querySelector('.js-tasks__display-create--input');
const saveTaskButton = document.querySelector('.js-tasks__display-create--buttons--save');
const cancelTaskButton = document.querySelector('.js-tasks__display-create--buttons--cancel');
const deleteAllTasksButton = document.querySelector('.js-tasks-settings__options--delete-all-tasks-button');
const deleteCompletedTasksButton = document.querySelector('.js-tasks-settings__options--delete-completed-tasks-button');
const toggleCompletedTasksButton = document.querySelector('.js-tasks-settings__options--toggle-completed-tasks-button');
let areCompletedTasksHidden = false;
const modalOverlay = document.querySelector('.js-modal-overlay');
const modalTitle = document.querySelector('.js-modal-title');
const modalText = document.querySelector('.js-modal-text');
const modalConfirmBtn = document.querySelector('.js-modal-confirm');
const modalCancelBtn = document.querySelector('.js-modal-cancel');
const iosModalOverlay = document.querySelector('.js-ios-modal-overlay');
const closeIosModalBtn = document.querySelector('.js-ios-modal-close');
let progressRing;
let radius;
let circumference;
const rootElement = document.documentElement;
let timerInterval = null;
const cycleIndicator = document.querySelector('.js-cycle-indicator');





// ==========================================================================
// 2. UI STRINGS OBJECT (for dynamic text)
// ==========================================================================


// Contains only text strings that are generated dynamically by JavaScript.
const uiStrings = {
    "en": {
        "play": "PLAY",
        "pause": "PAUSE",
        "edit": "Edit",
        "delete": "Delete",
        "hide_completed_tasks": "Hide Completed Tasks",
        "show_completed_tasks": "Show Completed Tasks",
        "confirm_action": "Confirm Action",
        "confirm_delete_all": "Are you sure you want to delete ALL tasks? This cannot be undone.",
        "confirm_delete_completed": "Are you sure you want to delete all COMPLETED tasks?",
        "confirm_delete_single": "Are you sure you want to delete the task: \"{task}\"?",
        "modal_cancel": "Cancel",
        "modal_confirm": "Confirm"
    },
    "pt-BR": {
        "play": "INICIAR",
        "pause": "PAUSAR",
        "edit": "Editar",
        "delete": "Excluir",
        "hide_completed_tasks": "Ocultar Tarefas Concluídas",
        "show_completed_tasks": "Mostrar Tarefas Concluídas",
        "confirm_action": "Confirmar Ação",
        "confirm_delete_all": "Tem certeza que deseja excluir TODAS as tarefas? Esta ação não pode ser desfeita.",
        "confirm_delete_completed": "Tem certeza que deseja excluir todas as tarefas CONCLUÍDAS?",
        "confirm_delete_single": "Tem certeza que deseja excluir a tarefa: \"{task}\"?",
        "modal_cancel": "Cancelar",
        "modal_confirm": "Confirmar"
    },
    "es": {
        "play": "INICIAR",
        "pause": "PAUSAR",
        "edit": "Editar",
        "delete": "Eliminar",
        "hide_completed_tasks": "Ocultar Tareas Completadas",
        "show_completed_tasks": "Mostrar Tareas Completadas",
        "confirm_action": "Confirmar Acción",
        "confirm_delete_all": "¿Estás seguro de que quieres eliminar TODAS las tareas? Esta acción no se puede deshacer.",
        "confirm_delete_completed": "¿Estás seguro de que quieres eliminar todas las tareas COMPLETADAS?",
        "confirm_delete_single": "¿Estás seguro de que quieres eliminar la tarea: \"{task}\"?",
        "modal_cancel": "Cancelar",
        "modal_confirm": "Confirmar"
    }
};




// ==========================================================================
// 3. THEME & UI FUNCTIONS
// ==========================================================================


/**
 * Applies theme colors based on the current timer mode (focus, break, etc.).
 */
const applyTheme = (mode) => {
    const isDarkMode = mainContainer.classList.contains('dark-mode');
    const themes = {
        focus: { bg: isDarkMode ? "#1E2A3A" : "#e7ffebff", accent: isDarkMode ? "#00C896" : "#1E2A3A" },
        break: { bg: isDarkMode ? "#0f2e24ff" : "#4fe9b5ff", accent: isDarkMode ? "#52d864ff" : "#002712ff" },
        longBreak: { bg: isDarkMode ? "#461935" : "rgb(238, 159, 248)", accent: isDarkMode ? "#b82f83ff" : "#240129ff" }
    };
    const theme = themes[mode] || themes.focus;
    rootElement.style.setProperty('--color-background', theme.bg);
    rootElement.style.setProperty('--color-accent', theme.accent);
};



/**
 * Toggles between dark and light mode and saves the preference.
 */
const darkModeTheme = () => {
    mainContainer.classList.toggle('dark-mode');
    rootElement.style.setProperty('--color-text-primary', mainContainer.classList.contains('dark-mode') ? '#F0F0F0' : '#1f1f1fff');
    rootElement.style.setProperty('--color-surface', mainContainer.classList.contains('dark-mode') ? '#162033' : '#afaeaeff');
    rootElement.style.setProperty('--color-muted', mainContainer.classList.contains('dark-mode') ? '#A0AEC0' : '#000000ff');
    applyTheme(currentMode);
};



darkModeToggle.addEventListener('click', darkModeTheme);




// ==========================================================================
// 4. TIMER LOGIC & STATE MANAGEMENT
// ==========================================================================


/**
 * Saves the current timer state to localStorage.
 * @param {object} state The state object to save.
 */
const saveTimerState = (state) => localStorage.setItem('flowtudyTimerState', JSON.stringify(state));



/**
 * Loads the timer state from localStorage.
 * @returns {object|null} The saved state object or null if none exists.
 */
const loadTimerState = () => JSON.parse(localStorage.getItem('flowtudyTimerState'));



// Main application state variables.
let currentMode = 'focus';
let endTime = 0;
const timers = { focus: 25 * 60, break: 5 * 60, longBreak: 15 * 60 };
let remainingTimes = { ...timers };
let longBreakSetting = 3;
let longBreakCountdown = 3;



/**
 * Creates the cycle indicator dots in the UI based on settings.
 */
const renderCycleIndicators = () => {
    cycleIndicator.innerHTML = '';
    for (let i = 0; i < longBreakSetting; i++) {
        const dot = document.createElement('div');
        dot.classList.add('cycle-dot');
        cycleIndicator.appendChild(dot);
    }
    updateCycleIndicators();
};



/**
 * Fills the cycle dots based on completed focus sessions.
 */
const updateCycleIndicators = () => {
    const dots = document.querySelectorAll('.cycle-dot');
    const completedCycles = longBreakSetting - longBreakCountdown;
    dots.forEach((dot, index) => {
        dot.classList.toggle('completed', index < completedCycles);
    });
};



/**
 * The main timer loop, called every second by setInterval.
 */
function tick() {
    const timeLeft = Math.round((endTime - Date.now()) / 1000);
    if (timeLeft < 0) {
        clearInterval(timerInterval);
        playSoundNotification();
        sendDesktopNotification();
        skipMode();
        return;
    }
    updateTimerDisplay(timeLeft, timers[currentMode]);
}



/**
 * Starts the timer countdown.
 */
function startTimer() {
    const duration = remainingTimes[currentMode];
    if (duration <= 0) return;
    endTime = Date.now() + duration * 1000;
    timerInterval = setInterval(tick, 1000);
    playPauseButton.classList.add('playing');
    updatePlayButtonText();
    saveTimerState({ endTime, currentMode, isRunning: true, longBreakCountdown });
}



/**
 * Pauses the timer.
 */
function pauseTimer() {
    clearInterval(timerInterval);
    const timeLeft = Math.round((endTime - Date.now()) / 1000);
    remainingTimes[currentMode] = timeLeft > 0 ? timeLeft : 0;
    playPauseButton.classList.remove('playing');
    updatePlayButtonText();
    saveTimerState({ remainingTime: remainingTimes[currentMode], currentMode, isRunning: false, longBreakCountdown });
}



/**
 * Updates the circular progress ring SVG.
 * @param {number} timeLeft The remaining time in seconds.
 * @param {number} totalTime The total time for the current mode in seconds.
 */
const updateProgressRing = (timeLeft, totalTime) => {
    if (totalTime <= 0 || timeLeft < 0) {
        progressRing.style.strokeDashoffset = circumference;
        return;
    }
    const offset = circumference * (1 - (timeLeft / totalTime));
    progressRing.style.strokeDashoffset = offset;
};



/**
 * Updates the time display on the screen and the page title.
 * @param {number} time The remaining time in seconds.
 * @param {number} totalTime The total time for the current mode in seconds.
 */
const updateTimerDisplay = (time, totalTime) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedTime = `${minutes}:${String(seconds).padStart(2, '0')}`;
    timerDisplay.textContent = formattedTime;
    document.title = `${formattedTime} - Flowtudy`;
    updateProgressRing(time, totalTime);
};



/**
 * Updates the play/pause button's text using the uiStrings object.
 */
const updatePlayButtonText = () => {
    const texts = uiStrings[currentLanguage];
    playPauseButton.textContent = playPauseButton.classList.contains('playing') ? texts.pause : texts.play;
};



/**
 * Resets the current timer to its full duration.
 */
const resetTimer = () => {
    clearInterval(timerInterval);
    remainingTimes[currentMode] = timers[currentMode];
    updateTimerDisplay(remainingTimes[currentMode], timers[currentMode]);
    playPauseButton.classList.remove('playing');
    updatePlayButtonText();
    localStorage.removeItem('flowtudyTimerState');
};



/**
 * Skips to the next mode in the Pomodoro cycle.
 */
const skipMode = () => {
    clearInterval(timerInterval);
    if (currentMode === 'focus') {
        longBreakCountdown--;
        updateCycleIndicators();
    }
    let nextMode;
    if (currentMode === 'focus') {
        nextMode = longBreakCountdown <= 0 ? 'longBreak' : 'break';
    } else {
        nextMode = 'focus';
        if (currentMode === 'longBreak') {
            longBreakCountdown = longBreakSetting;
            updateCycleIndicators();
        }
    }
    currentMode = nextMode;
    timerModesButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === currentMode));
    applyTheme(currentMode);
    remainingTimes = { ...timers };
    updateTimerDisplay(timers[currentMode], timers[currentMode]);
    playPauseButton.classList.remove('playing');
    updatePlayButtonText();
    const autoStartBreaks = breaksAutoStartInput.checked;
    const autoStartFocus = focusAutoStartInput.checked;
    if ((autoStartBreaks && ['break', 'longBreak'].includes(currentMode)) || (autoStartFocus && currentMode === 'focus')) {
        startTimer();
    } else {
        saveTimerState({ remainingTime: remainingTimes[currentMode], currentMode, isRunning: false, longBreakCountdown });
    }
};



// Event listeners for timer controls.
playPauseButton.addEventListener('click', () => {
    playPauseButton.classList.contains('playing') ? pauseTimer() : startTimer();
});



resetButton.addEventListener('click', resetTimer);



skipButton.addEventListener('click', skipMode);



// Event listeners for mode selection buttons.
timerModesButtons.forEach(button => {
    button.addEventListener('click', () => {
        clearInterval(timerInterval);
        currentMode = button.dataset.mode;
        timerModesButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        applyTheme(currentMode);
        remainingTimes[currentMode] = timers[currentMode];
        updateTimerDisplay(remainingTimes[currentMode], timers[currentMode]);
        playPauseButton.classList.remove('playing');
        updatePlayButtonText();
        saveTimerState({ remainingTime: remainingTimes[currentMode], currentMode, isRunning: false, longBreakCountdown });
    });
});




// ==========================================================================
// 5. SETTINGS PANEL & NOTIFICATIONS
// ==========================================================================


/**
 * Saves the timer's current state before closing settings panel.
 */
const saveCurrentTimerState = () => {
    const isRunning = playPauseButton.classList.contains('playing');
    if (isRunning) {
        saveTimerState({ endTime, currentMode, isRunning: true, longBreakCountdown });
    } else {
        saveTimerState({ remainingTime: remainingTimes[currentMode], currentMode, isRunning: false, longBreakCountdown });
    }
};



/**
 * Saves all user settings to localStorage.
 */
const saveSettings = () => {
    const settings = {
        focus: usersFocusTime.value || 25,
        break: usersBreakTime.value || 5,
        longBreak: usersLongBreakTime.value || 15,
        interval: usersLongBreakInterval.value || 3,
        autoStartBreaks: breaksAutoStartInput.checked,
        autoStartFocus: focusAutoStartInput.checked,
        sound: soundNotificationInput.checked,
        popup: popUpInput.checked
    };
    localStorage.setItem('flowtudySettings', JSON.stringify(settings));
};



/**
 * Loads user settings from localStorage on startup.
 */
const loadSettings = () => {
    const savedSettings = JSON.parse(localStorage.getItem('flowtudySettings'));
    if (savedSettings) {
        usersFocusTime.value = savedSettings.focus;
        usersBreakTime.value = savedSettings.break;
        usersLongBreakTime.value = savedSettings.longBreak;
        usersLongBreakInterval.value = savedSettings.interval;
        breaksAutoStartInput.checked = savedSettings.autoStartBreaks;
        focusAutoStartInput.checked = savedSettings.autoStartFocus;
        soundNotificationInput.checked = savedSettings.sound;
        if (Notification.permission !== 'granted') savedSettings.popup = false;
        popUpInput.checked = savedSettings.popup;
        changeTimerDuration('focus', false);
        changeTimerDuration('break', false);
        changeTimerDuration('longBreak', false);
        changeLongBreakInterval(false);
        handleNotificationPermission(false);
    } else {
        changeLongBreakInterval(false);
    }
};



/**
 * Toggles the visibility of the main settings panel.
 */
const showSettingsForm = () => {
    settingsForm.hidden = !settingsForm.hidden;
    if (settingsForm.hidden) {
        saveCurrentTimerState();
    }
};



/**
 * Updates a timer's duration, recalculating proportionally if it's running.
 * @param {string} mode - 'focus', 'break', or 'longBreak'.
 * @param {boolean} shouldSave - Whether to save settings to localStorage.
 */
const changeTimerDuration = (mode, shouldSave = true) => {
    const oldDuration = timers[mode];
    const inputElement = { focus: usersFocusTime, break: usersBreakTime, longBreak: usersLongBreakTime }[mode];
    const defaultValues = { focus: 25, break: 5, longBreak: 15 };
    const newMinutes = inputElement.value || defaultValues[mode];
    const newDuration = newMinutes * 60;
    timers[mode] = newDuration;
    if (currentMode === mode) {
        const isRunning = playPauseButton.classList.contains('playing');
        const timeLeftBeforeChange = isRunning ? Math.round((endTime - Date.now()) / 1000) : remainingTimes[mode];
        const progressRatio = oldDuration > 0 ? timeLeftBeforeChange / oldDuration : 1;
        const newTimeLeft = Math.round(newDuration * progressRatio);
        remainingTimes[mode] = newTimeLeft;
        if (isRunning) {
            endTime = Date.now() + newTimeLeft * 1000;
        }
        updateTimerDisplay(newTimeLeft, newDuration);
    }
    if (shouldSave) saveSettings();
};



/**
 * Updates the long break interval setting.
 * @param {boolean} shouldSave - Whether to save settings to localStorage.
 */
const changeLongBreakInterval = (shouldSave = true) => {
    const newInterval = usersLongBreakInterval.value || 3;
    longBreakSetting = parseInt(newInterval, 10);
    if (longBreakCountdown > longBreakSetting) {
        longBreakCountdown = longBreakSetting;
    }
    showLongBreakInterval.textContent = newInterval;
    renderCycleIndicators();
    if (shouldSave) saveSettings();
};



/**
 * Plays the notification sound if enabled.
 */
const playSoundNotification = () => {
    if (soundNotificationInput.checked) {
        soundNotification.currentTime = 0;
        soundNotification.play().catch(e => console.error("Sound play failed:", e));
    }
};



/**
 * Sends a desktop notification if enabled and permission is granted.
 */
const sendDesktopNotification = () => {
    if (popUpInput.checked && Notification.permission === 'granted') {
        const title = "Flowtudy";
        const body = `Time for your ${currentMode} session is up!`;
        new Notification(title, { body });
    }
};



/**
 * Asks for permission to send notifications, or shows
 * platform-specific instructions for mobile devices.
 * @param {boolean} shouldSave - Whether to save settings to localStorage.
 */
const handleNotificationPermission = async (shouldSave = true) => {
    const isCurrentlyPWA = await isPWA();
    // If it's a mobile device, show the instructions modal
    if (isMobile() && !isPWA()) {
        const modal = iosModalOverlay.querySelector('.modal');
        // Clean up old classes and add the correct one for the current OS
        modal.classList.remove('modal--show-ios', 'modal--show-android');
        if (isIOS()) {
            modal.classList.add('modal--show-ios');
        } else {
            modal.classList.add('modal--show-android');
        }
        iosModalOverlay.classList.add('modal-overlay--visible');
        popUpInput.checked = false; // Ensure the toggle remains off
        if (shouldSave) saveSettings();
        return; // Stop the function here for mobile
    }

    // Original logic for Desktop browsers and PWAs
    if (!('Notification' in window)) {
        console.log("This browser does not support desktop notification");
        popUpInput.checked = false;
        if (shouldSave) saveSettings();
        return;
    }

    if (popUpInput.checked) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            popUpInput.checked = false;
        }
    }

    if (shouldSave) saveSettings();
};



// Event listeners for the settings panel.
settingsButton.addEventListener('click', showSettingsForm);
usersFocusTime.addEventListener('change', () => changeTimerDuration('focus'));
usersBreakTime.addEventListener('change', () => changeTimerDuration('break'));
usersLongBreakTime.addEventListener('change', () => changeTimerDuration('longBreak'));
usersLongBreakInterval.addEventListener('change', () => changeLongBreakInterval());
breaksAutoStartInput.addEventListener('change', saveSettings);
focusAutoStartInput.addEventListener('change', saveSettings);
soundNotificationInput.addEventListener('change', saveSettings);
popUpInput.addEventListener('change', () => handleNotificationPermission());



// Global click listener to close panels when clicking outside.
document.addEventListener('click', (event) => {
    if (!settingsForm.hidden && !settingsButton.contains(event.target) && !settingsForm.contains(event.target)) {
        showSettingsForm();
    }
    if (!tasksSettingsForm.hidden && !tasksSettingsButton.contains(event.target) && !tasksSettingsForm.contains(event.target)) {
        showTasksSettings();
    }
});


// Event listeners for the mobile instructions modal
if (iosModalOverlay) {
    closeIosModalBtn.addEventListener('click', () => {
        iosModalOverlay.classList.remove('modal-overlay--visible');
    });

    iosModalOverlay.addEventListener('click', (event) => {
        if (event.target === iosModalOverlay) {
            iosModalOverlay.classList.remove('modal-overlay--visible');
        }
    });
}




// ==========================================================================
// 6. TASKS SECTION LOGIC
// ==========================================================================


/**
 * Shows a confirmation modal for destructive actions.
 * @param {string} title - The title of the modal.
 * @param {string} message - The confirmation message.
 * @returns {Promise<boolean>} - A promise that resolves to true if confirmed, false otherwise.
 */
const showConfirmationModal = (title, message) => {
    return new Promise((resolve) => {
        const texts = uiStrings[currentLanguage];
        modalTitle.textContent = title;
        modalText.textContent = message;
        modalCancelBtn.textContent = texts.modal_cancel;
        modalConfirmBtn.textContent = texts.modal_confirm;
        modalOverlay.classList.add('modal-overlay--visible');
        const confirmHandler = () => { cleanup(); resolve(true); };
        const cancelHandler = () => { cleanup(); resolve(false); };
        const cleanup = () => {
            modalOverlay.classList.remove('modal-overlay--visible');
            modalConfirmBtn.removeEventListener('click', confirmHandler);
            modalCancelBtn.removeEventListener('click', cancelHandler);
        };
        modalConfirmBtn.addEventListener('click', confirmHandler, { once: true });
        modalCancelBtn.addEventListener('click', cancelHandler, { once: true });
    });
};



/**
 * Toggles the visibility of the tasks settings menu.
 */
const showTasksSettings = () => {
    tasksSettingsForm.hidden = !tasksSettingsForm.hidden;
};



/**
 * Deletes all tasks after receiving confirmation.
 */
const deleteAllTasks = async () => {
    if (document.querySelectorAll('.task-item').length > 0) {
        const texts = uiStrings[currentLanguage];
        const confirmed = await showConfirmationModal(texts.confirm_action, texts.confirm_delete_all);
        if (confirmed) {
            document.querySelectorAll('.task-item').forEach(task => task.remove());
            saveTasks();
        }
    }
    showTasksSettings();
};



/**
 * Deletes only completed tasks after receiving confirmation.
 */
const deleteCompletedTasks = async () => {
    if (document.querySelectorAll('.task-item--completed').length > 0) {
        const texts = uiStrings[currentLanguage];
        const confirmed = await showConfirmationModal(texts.confirm_action, texts.confirm_delete_completed);
        if (confirmed) {
            document.querySelectorAll('.task-item--completed').forEach(task => task.remove());
            saveTasks();
        }
    }
    showTasksSettings();
};



/**
 * Shows or hides completed tasks based on the current setting.
 */
const updateCompletedTasksVisibility = () => {
    document.querySelectorAll('.task-item--completed').forEach(task => {
        task.hidden = areCompletedTasksHidden;
    });
};



/**
 * Toggles the setting for hiding/showing completed tasks.
 */
const toggleCompletedTasksVisibility = () => {
    areCompletedTasksHidden = !areCompletedTasksHidden;
    const texts = uiStrings[currentLanguage];
    const buttonText = toggleCompletedTasksButton.querySelector('p');
    const buttonIcon = toggleCompletedTasksButton.querySelector('.material-symbols-outlined');
    buttonText.textContent = areCompletedTasksHidden ? texts.show_completed_tasks : texts.hide_completed_tasks;
    buttonIcon.textContent = areCompletedTasksHidden ? 'visibility' : 'disabled_visible';
    updateCompletedTasksVisibility();
    showTasksSettings();
};



// Event listeners for the tasks settings menu.
deleteAllTasksButton.addEventListener('click', deleteAllTasks);
deleteCompletedTasksButton.addEventListener('click', deleteCompletedTasks);
toggleCompletedTasksButton.addEventListener('click', toggleCompletedTasksVisibility);
tasksSettingsButton.addEventListener('click', (e) => {
    e.stopPropagation();
    showTasksSettings();
});



/**
 * Saves the current list of tasks to localStorage.
 */
const saveTasks = () => {
    const tasks = Array.from(document.querySelectorAll('.task-item')).map(el => ({
        text: el.querySelector('.task-item__text').textContent,
        completed: el.classList.contains('task-item--completed')
    }));
    localStorage.setItem('flowtudyTasks', JSON.stringify(tasks));
};



/**
 * Loads tasks from localStorage on startup.
 */
const loadTasks = () => {
    tasksContainer.querySelectorAll('.task-item').forEach(task => task.remove());
    const savedTasks = JSON.parse(localStorage.getItem('flowtudyTasks') || '[]');
    savedTasks.forEach(task => renderTask(task));
    updateCompletedTasksVisibility();
};



/**
 * Creates and appends a single task item to the DOM.
 * @param {object} task - The task object with text and completed status.
 */
const renderTask = (task) => {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.draggable = true;
    taskItem.classList.add('task-item--new');
    taskItem.addEventListener('animationend', () => taskItem.classList.remove('task-item--new'), { once: true });
    if (task.completed) taskItem.classList.add('task-item--completed');
    const sanitizedText = document.createTextNode(task.text).textContent;
    taskItem.innerHTML = `
        <input type="checkbox" class="task-item__checkbox" ${task.completed ? 'checked' : ''}>
        <p class="task-item__text">${sanitizedText}</p>
        <div class="task-item__edit-container">
            <input type="text" class="task-item__edit-input" value="${sanitizedText}">
            <button class="task-item__edit-button" data-action="save-edit" aria-label="Save"><span class="material-symbols-outlined">check</span></button>
            <button class="task-item__edit-button" data-action="cancel-edit" aria-label="Cancel"><span class="material-symbols-outlined">close</span></button>
        </div>
        <button class="button button-icon task-item__options" aria-label="Task options"><span class="material-symbols-outlined">more_vert</span></button>
    `;
    tasksContainer.insertBefore(taskItem, addTaskButton);
};



/**
 * Shows the form for creating a new task.
 */
const showTaskCreator = () => {
    addTaskButton.hidden = true;
    taskCreationForm.hidden = false;
    taskInput.focus();
};



/**
 * Hides the form for creating a new task.
 */
const hideTaskCreator = () => {
    taskCreationForm.hidden = true;
    addTaskButton.hidden = false;
    taskInput.value = '';
};



/**
 * Creates a new task from the input value.
 */
const createTask = () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        renderTask({ text: taskText, completed: false });
        saveTasks();
        hideTaskCreator();
    }
};



/**
 * Puts a task item into editing mode.
 * @param {HTMLElement} taskItem - The task element to edit.
 */
const enterEditMode = (taskItem) => {
    taskItem.classList.add('task-item--editing');
    taskItem.querySelector('.task-item__edit-input').focus();
};



/**
 * Takes a task item out of editing mode.
 * @param {HTMLElement} taskItem - The task element to exit edit mode from.
 */
const exitEditMode = (taskItem) => {
    taskItem.classList.remove('task-item--editing');
};



// Event listeners for task creation.
addTaskButton.addEventListener('click', showTaskCreator);
cancelTaskButton.addEventListener('click', hideTaskCreator);
saveTaskButton.addEventListener('click', createTask);
taskInput.addEventListener('keypress', (event) => { if (event.key === 'Enter') createTask(); });



// Event listener for task completion (checkbox).
tasksContainer.addEventListener('change', (event) => {
    if (event.target.classList.contains('task-item__checkbox')) {
        const taskItem = event.target.closest('.task-item');
        taskItem.classList.toggle('task-item--completed');
        updateCompletedTasksVisibility();
        saveTasks();
    }
});



// Event delegation for all actions within the tasks container.
tasksContainer.addEventListener('click', async (event) => {
    const actionElement = event.target.closest('[data-action]');
    const optionsButton = event.target.closest('.task-item__options');
    const taskItem = event.target.closest('.task-item');
    if (!taskItem && !optionsButton) return;
    if (actionElement) {
        const action = actionElement.dataset.action;
        if (action === 'edit') {
            enterEditMode(taskItem);
            closeAllMenus();
        }
        if (action === 'delete') {
            const texts = uiStrings[currentLanguage];
            const taskText = taskItem.querySelector('.task-item__text').textContent;
            const msg = texts.confirm_delete_single.replace('{task}', taskText);
            const confirmed = await showConfirmationModal(texts.delete, msg);
            if (confirmed) {
                taskItem.remove();
                saveTasks();
            }
        }
        if (action === 'save-edit') {
            const input = taskItem.querySelector('.task-item__edit-input');
            const newText = input.value.trim();
            if (newText) {
                taskItem.querySelector('.task-item__text').textContent = newText;
                saveTasks();
            }
            exitEditMode(taskItem);
        }
        if (action === 'cancel-edit') {
            exitEditMode(taskItem);
        }
    } else if (optionsButton) {
        toggleMenu(optionsButton.parentElement);
    }
});



/**
 * Closes all open task option menus.
 */
const closeAllMenus = () => {
    document.querySelectorAll('.task-item__menu.active').forEach(menu => menu.classList.remove('active'));
};



/**
 * Toggles the visibility of a single task's option menu.
 * @param {HTMLElement} taskItem - The parent task item of the menu.
 */
const toggleMenu = (taskItem) => {
    let menu = taskItem.querySelector('.task-item__menu');
    const wasActive = menu && menu.classList.contains('active');
    closeAllMenus();
    if (!menu) {
        const texts = uiStrings[currentLanguage];
        menu = document.createElement('div');
        menu.className = 'task-item__menu';
        menu.innerHTML = `<div class="task-item__menu-option" data-action="edit"><span class="material-symbols-outlined">edit</span> ${texts.edit}</div><div class="task-item__menu-option" data-action="delete"><span class="material-symbols-outlined">delete</span> ${texts.delete}</div>`;
        taskItem.appendChild(menu);
    }
    if (!wasActive) {
        setTimeout(() => menu.classList.add('active'), 10);
    }
};



// Global click listener to close task menus when clicking outside.
document.addEventListener('click', (event) => {
    if (!event.target.closest('.task-item')) closeAllMenus();
});



// Event listeners for drag and drop functionality.
tasksContainer.addEventListener('dragstart', (event) => {
    if (event.target.classList.contains('task-item')) event.target.classList.add('dragging');
});



tasksContainer.addEventListener('dragend', (event) => {
    if (event.target.classList.contains('task-item')) {
        event.target.classList.remove('dragging');
        saveTasks();
    }
});



tasksContainer.addEventListener('dragover', (event) => {
    event.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    if (!draggingItem) return;
    const afterElement = [...tasksContainer.querySelectorAll('.task-item:not(.dragging)')]
        .reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = event.clientY - box.top - box.height / 2;
            return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    tasksContainer.insertBefore(draggingItem, afterElement || addTaskButton);
});




// ==========================================================================
// 7. LANGUAGE & NAVIGATION
// ==========================================================================


const languageButton = document.querySelector('.js-language-button');
const languageMenu = document.querySelector('.js-language-menu');
let currentLanguage = 'en';



/**
 * Saves the selected language to localStorage.
 * @param {string} lang - The language code (e.g., 'en', 'pt-BR').
 */
const saveLanguage = (lang) => localStorage.setItem('flowtudyLanguage', lang);



/**
 * Dynamically creates the language menu options as actual links.
 */
const updateLanguageMenu = () => {
    // Define the language options as an array of objects
    const languages = [
        { code: 'en', name: 'EN', flag: '🇺🇸', path: '/', active: currentLanguage === 'en' },
        { code: 'pt-BR', name: 'PT-BR', flag: '🇧🇷', path: '/pt/', active: currentLanguage === 'pt-BR' },
        { code: 'es', name: 'ES', flag: '🇪🇸', path: '/es/', active: currentLanguage === 'es' }
    ];

    // Build the HTML for the menu using the array
    languageMenu.innerHTML = languages.map(lang => `
        <a href="${lang.path}" class="language-option ${lang.active ? 'active' : ''}">
            <span class="language-flag">${lang.flag}</span> 
            ${lang.name} 
            <span class="material-symbols-outlined language-check">check</span>
        </a>
    `).join('');
};



/**
 * Initializes the language on page load based on the HTML lang attribute.
 */
const initLanguage = () => {
    const pageLang = document.documentElement.lang;
    if (pageLang.startsWith('pt')) {
        currentLanguage = 'pt-BR';
    } else if (pageLang === 'es') {
        currentLanguage = 'es';
    } else {
        currentLanguage = 'en';
    }
    saveLanguage(currentLanguage);
    updateLanguageMenu();
    updatePlayButtonText(); // Crucial to set the initial play button text
};



// Event listeners for the language menu.
languageButton.addEventListener('click', (e) => {
    e.stopPropagation();
    languageMenu.classList.toggle('active');
});



document.addEventListener('click', (e) => {
    if (languageMenu.classList.contains('active') && !languageButton.contains(e.target) && !languageMenu.contains(e.target)) {
        languageMenu.classList.remove('active');
    }
});



/**
 * Checks if the user is on any mobile device using a robust method
 * that also detects iPads/iPhones pretending to be Macs.
 * @returns {boolean}
 */
const isMobile = () => {
    // Standard check for most mobile devices
    const isStandardMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // Check for iPad/iPhone on iOS 13+ pretending to be a Mac
    const isDisguisedIOS = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    return isStandardMobile || isDisguisedIOS;
};


/**
 * Checks if the user is on an iOS device (iPhone, iPad, iPod).
 * This check is more specific and reliable.
 * @returns {boolean}
 */
const isIOS = () => {
    // The user agent check is more reliable for distinguishing iOS from other mobiles
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};



/**
 * Checks if the app is running in standalone mode (as a PWA).
 * @returns {boolean}
 */
const isPWA = () => {
    return new Promise((resolve) => {
        const hasPwaParam = new URLSearchParams(window.location.search).has('mode');
        if (hasPwaParam) {
            resolve(true);
            return;
        }

        setTimeout(() => {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            
            const isIOSStandalone = window.navigator.standalone === true;

            resolve(isStandalone || isIOSStandalone);
        }, 500);
    });
};




// ==========================================================================
// 8. INITIALIZATION ON PAGE LOAD
// ==========================================================================


/**
 * This function runs when the page has finished loading.
 */
document.addEventListener('DOMContentLoaded', () => {
    progressRing = document.querySelector('.js-progress-ring');
    radius = parseFloat(progressRing.getAttribute('r'));
    circumference = 2 * Math.PI * radius;

    // Initialize the progress ring SVG stroke
    progressRing.style.strokeDasharray = `${circumference} ${circumference}`;

    // Set up the application in the correct order
    initLanguage();
    loadSettings();
    loadTasks();
    renderCycleIndicators();

    // Restore the timer state from localStorage if it exists
    const savedTimer = loadTimerState();
    if (savedTimer) {
        currentMode = savedTimer.currentMode;
        longBreakCountdown = savedTimer.longBreakCountdown ?? longBreakSetting;
        updateCycleIndicators();
        timerModesButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === currentMode));
        applyTheme(currentMode);
        if (savedTimer.isRunning) {
            const timeLeft = Math.round((savedTimer.endTime - Date.now()) / 1000);
            if (timeLeft > 0) {
                remainingTimes[currentMode] = timeLeft;
                startTimer();
                tick(); // Call tick once immediately to avoid 1s delay in display
            } else {
                skipMode();
            }
        } else {
            remainingTimes[currentMode] = savedTimer.remainingTime;
            updateTimerDisplay(savedTimer.remainingTime, timers[currentMode]);
        }
    } else {
        // If no saved state, set the initial display for focus mode
        updateTimerDisplay(timers.focus, timers.focus);
    }

    // Set up the intersection observer for info card animations
    const infoCards = document.querySelectorAll('.info-card');
    if (infoCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('info-card--visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        infoCards.forEach(card => observer.observe(card));
    }
});