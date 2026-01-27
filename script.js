/**
     * @file script.js
     * @description Main JavaScript file for the Focus Sprint Pomodoro application.
     * @author Flávio Tomás Peña Villa
     * @version 1.0
     * @date Jan 2026
     *
     * -------------------------------------------------------------------------- *
    *
    * PROJECT: Focus Sprint
    * DESCRIPTION: A fully-featured Pomodoro timer application built with vanilla
    *              JavaScript, HTML, and CSS. It helps users manage their focus
    *              and break sessions effectively.
    *
    * KEY FEATURES:
    * - Customizable Pomodoro, Short Break, and Long Break timers.
    * - Integrated task management with drag-and-drop reordering.
    * - Light and Dark theme support.
    * - Multi-language support (English, Portuguese, Spanish).
    * - Visual cycle indicator for long breaks.
    * - Sound and desktop notifications.
    * - All settings and tasks saved to localStorage.
    *
    * -------------------------------------------------------------------------- *
    *
    * TABLE OF CONTENTS:
    * 1. VARIABLE DECLARATIONS
    * 2. TRANSLATIONS OBJECT
    * 3. THEME & UI FUNCTIONS
    * 4. TIMER LOGIC & STATE MANAGEMENT
    * 5. SETTINGS PANEL & NOTIFICATIONS
    * 6. TASKS SECTION LOGIC
    * 7. LANGUAGE & TRANSLATION
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
const progressRing = document.querySelector('.js-progress-ring');
const radius = progressRing.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
const rootElement = document.documentElement;
let timerInterval = null;
const cycleIndicator = document.querySelector('.js-cycle-indicator');


// ==========================================================================
// 2. TRANSLATIONS OBJECT
// ==========================================================================
// Contains all text strings for different languages.

const translations = {
    "en": { "app_name": "Focus Sprint", "focus_time": "Focus Time", "break": "Break", "long_break": "Long break", "tasks": "Tasks", "add_task": "Add Task", "task_placeholder": "What are you doing today?", "save": "Save", "cancel": "Cancel", "delete_all_tasks": "Delete All Tasks", "delete_completed_tasks": "Delete Completed Tasks", "hide_completed_tasks": "Hide Completed Tasks", "show_completed_tasks": "Show Completed Tasks", "settings": "Settings", "auto_start_breaks": "Auto Start Breaks", "auto_start_focus": "Auto Start Focus", "long_break_interval": "Long Break Every", "breaks": "Breaks", "timers": "TIMERS", "focus": "Focus", "break_time": "Break", "long_break_time": "Long Break", "notifications": "NOTIFICATIONS", "sound_alarm": "Sound Alarm When Timer is Finished", "pop_up": "Pop Up When Timer is Finished", "play": "PLAY", "pause": "PAUSE", "reset": "Reset timer", "skip": "Skip to next cycle", "dark_mode": "Toggle dark mode", "settings_button": "Settings", "more_options": "More task options", "edit": "Edit", "delete": "Delete", "confirm_action": "Confirm Action", "confirm_delete_all": "Are you sure you want to delete ALL tasks? This cannot be undone.", "confirm_delete_completed": "Are you sure you want to delete all COMPLETED tasks?", "confirm_delete_single": "Are you sure you want to delete the task: \"{task}\"?", "modal_cancel": "Cancel", "modal_confirm": "Confirm", "info_title": "Master Your Focus with the Pomodoro Technique", "info_what_is": "What is the Pomodoro Technique?", "info_what_is_text": "The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a 'pomodoro,' from the Italian word for 'tomato,' after the tomato-shaped kitchen timer that Cirillo used as a university student.", "info_how_it_works": "How It Works", "info_steps": ["Decide on the task to be done.", "Set the pomodoro timer (typically for 25 minutes).", "Work on the task until the timer rings.", "Take a short break (3-5 minutes).", "After four pomodoros, take a longer break (15-30 minutes)."], "info_why_use": "Why Use It?", "info_benefits": [{ "icon": "neurology", "title": "Improves Focus:", "text": "Helps resist self-interruptions and re-trains your brain to stay on task." }, { "icon": "self_improvement", "title": "Reduces Burnout:", "text": "The frequent breaks are essential for mental agility and motivation." }, { "icon": "insights", "title": "Increases Awareness:", "text": "You'll gain a clearer understanding of how long tasks actually take." }, { "icon": "psychology", "title": "Reduces Anxiety:", "text": "By focusing on '25 minutes of work' instead of a huge project, tasks feel less daunting." }], "info_tips": "Pro Tips for Success", "info_tips_list": ["<strong>Protect Your Pomodoro:</strong> If you're interrupted during a focus session, either pause the timer or end the pomodoro. Avoid context switching.", "<strong>Use Breaks Wisely:</strong> Don't do anything demanding during your break. Stretch, get water, or look out the window. Avoid checking email or social media.", "<strong>Adapt the Timings:</strong> While 25/5 is the classic split, feel free to experiment. You might find 50/10 works better for you on certain tasks.", "<strong>Combine with a To-Do List:</strong> Use your task list to decide what to work on during each pomodoro session for maximum clarity."], "scroll_down": "Scroll down to learn more", "language": "Language" },
    "pt-BR": { "app_name": "Focus Sprint", "focus_time": "Tempo de Foco", "break": "Intervalo", "long_break": "Intervalo Longo", "tasks": "Tarefas", "add_task": "Adicionar Tarefa", "task_placeholder": "O que você vai fazer hoje?", "save": "Salvar", "cancel": "Cancelar", "delete_all_tasks": "Excluir Todas as Tarefas", "delete_completed_tasks": "Excluir Tarefas Concluídas", "hide_completed_tasks": "Ocultar Tarefas Concluídas", "show_completed_tasks": "Mostrar Tarefas Concluídas", "settings": "Configurações", "auto_start_breaks": "Iniciar Intervalos Automaticamente", "auto_start_focus": "Iniciar Foco Automaticamente", "long_break_interval": "Intervalo Longo a Cada", "breaks": "Intervalos", "timers": "TEMPORIZADORES", "focus": "Foco", "break_time": "Intervalo", "long_break_time": "Intervalo Longo", "notifications": "NOTIFICAÇÕES", "sound_alarm": "Tocar Alarme Quando o Temporizador Terminar", "pop_up": "Pop-up Quando o Temporizador Terminar", "play": "INICIAR", "pause": "PAUSAR", "reset": "Reiniciar temporizador", "skip": "Pular para próximo ciclo", "dark_mode": "Alternar modo escuro", "settings_button": "Configurações", "more_options": "Mais opções de tarefa", "edit": "Editar", "delete": "Excluir", "confirm_action": "Confirmar Ação", "confirm_delete_all": "Tem certeza que deseja excluir TODAS as tarefas? Esta ação não pode ser desfeita.", "confirm_delete_completed": "Tem certeza que deseja excluir todas as tarefas CONCLUÍDAS?", "confirm_delete_single": "Tem certeza que deseja excluir a tarefa: \"{task}\"?", "modal_cancel": "Cancelar", "modal_confirm": "Confirmar", "info_title": "Domine Seu Foco com a Técnica Pomodoro", "info_what_is": "O que é a Técnica Pomodoro?", "info_what_is_text": "A Técnica Pomodoro é um método de gerenciamento de tempo desenvolvido por Francesco Cirillo no final dos anos 1980. Ela usa um temporizador para dividir o trabalho em intervalos, tradicionalmente de 25 minutos de duração, separados por pausas curtas. Cada intervalo é conhecido como um 'pomodoro', da palavra italiana para 'tomate', em referência ao temporizador de cozinha em forma de tomate que Cirillo usava quando era estudante universitário.", "info_how_it_works": "Como Funciona", "info_steps": ["Decida qual tarefa será realizada.", "Ajuste o temporizador pomodoro (normalmente para 25 minutos).", "Trabalhe na tarefa até o temporizador tocar.", "Faça uma pausa curta (3-5 minutos).", "Após quatro pomodoros, faça uma pausa mais longa (15-30 minutos)."], "info_why_use": "Por que Usar?", "info_benefits": [{ "icon": "neurology", "title": "Melhora o Foco:", "text": "Ajuda a resistir a autointerrupções e retreina seu cérebro para permanecer na tarefa." }, { "icon": "self_improvement", "title": "Reduz o Esgotamento:", "text": "As pausas frequentes são essenciais para agilidade mental e motivação." }, { "icon": "insights", "title": "Aumenta a Consciência:", "text": "Você terá uma compreensão mais clara de quanto tempo as tarefas realmente levam." }, { "icon": "psychology", "title": "Reduz a Ansiedade:", "text": "Ao focar em '25 minutos de trabalho' em vez de um projeto enorme, as tarefas parecem menos assustadoras." }], "info_tips": "Dicas Profissionais para o Sucesso", "info_tips_list": ["<strong>Proteja Seu Pomodoro:</strong> Se você for interrompido durante uma sessão de foco, pause o temporizador ou termine o pomodoro. Evite mudar de contexto.", "<strong>Use as Pausas com Sabedoria:</strong> Não faça nada exigente durante sua pausa. Alongue-se, beba água ou olhe pela janela. Evite verificar e-mail ou redes sociais.", "<strong>Adapte os Tempos:</strong> Embora 25/5 seja a divisão clássica, sinta-se à vontade para experimentar. Você pode descobrir que 50/10 funciona melhor para você em certas tarefas.", "<strong>Combine com uma Lista de Tarefas:</strong> Use sua lista de tarefas para decidir no que trabalhar durante cada sessão pomodoro para máxima clareza."], "scroll_down": "Role para baixo para aprender mais", "language": "Idioma" },
    "es": { "app_name": "Focus Sprint", "focus_time": "Tiempo de Enfoque", "break": "Descanso", "long_break": "Descanso Largo", "tasks": "Tareas", "add_task": "Añadir Tarea", "task_placeholder": "¿Qué vas a hacer hoy?", "save": "Guardar", "cancel": "Cancelar", "delete_all_tasks": "Eliminar Todas las Tareas", "delete_completed_tasks": "Eliminar Tareas Completadas", "hide_completed_tasks": "Ocultar Tareas Completadas", "show_completed_tasks": "Mostrar Tareas Completadas", "settings": "Configuración", "auto_start_breaks": "Iniciar Descansos Automáticamente", "auto_start_focus": "Iniciar Enfoque Automáticamente", "long_break_interval": "Descanso Largo Cada", "breaks": "Descansos", "timers": "TEMPORIZADORES", "focus": "Enfoque", "break_time": "Descanso", "long_break_time": "Descanso Largo", "notifications": "NOTIFICACIONES", "sound_alarm": "Sonar Alarma Cuando el Temporizador Termine", "pop_up": "Ventana Emergente Cuando el Temporizador Termine", "play": "INICIAR", "pause": "PAUSAR", "reset": "Reiniciar temporizador", "skip": "Saltar al siguiente ciclo", "dark_mode": "Alternar modo oscuro", "settings_button": "Configuração", "more_options": "Más opciones de tarea", "edit": "Editar", "delete": "Eliminar", "confirm_action": "Confirmar Acción", "confirm_delete_all": "¿Estás seguro de que quieres eliminar TODAS las tareas? Esta acción no se puede deshacer.", "confirm_delete_completed": "¿Estás seguro de que quieres eliminar todas las tareas COMPLETADAS?", "confirm_delete_single": "¿Estás seguro de que quieres eliminar la tarea: \"{task}\"?", "modal_cancel": "Cancelar", "modal_confirm": "Confirmar", "info_title": "Domina Tu Enfoque con la Técnica Pomodoro", "info_what_is": "¿Qué es la Técnica Pomodoro?", "info_what_is_text": "La Técnica Pomodoro es un método de gestión del tiempo desarrollado por Francesco Cirillo a finales de los años 1980. Utiliza un temporizador para dividir el trabajo en intervalos, tradicionalmente de 25 minutos de duración, separados por breves descansos. Cada intervalo se conoce como un 'pomodoro', de la palabra italiana para 'tomate', en referencia al temporizador de cocina en forma de tomate que Cirillo usaba cuando era estudiante universitario.", "info_how_it_works": "Cómo Funciona", "info_steps": ["Decide la tarea a realizar.", "Configura el temporizador pomodoro (normalmente para 25 minutos).", "Trabaja en la tarea hasta que suene el temporizador.", "Toma un descanso corto (3-5 minutos).", "Después de cuatro pomodoros, toma un descanso más largo (15-30 minutos)."], "info_why_use": "¿Por qué Usarla?", "info_benefits": [{ "icon": "neurology", "title": "Mejora el Enfoque:", "text": "Ayuda a resistir las autointerrupciones y reentrena tu cerebro para mantenerse en la tarea." }, { "icon": "self_improvement", "title": "Reduz o Esgotamento:", "text": "Los descansos frequentes são essenciais para a agilidade mental e a motivação." }, { "icon": "insights", "title": "Aumenta la Conciencia:", "text": "Obtendrás una comprensión más clara de cuánto tiempo realmente toman las tareas." }, { "icon": "psychology", "title": "Reduce la Ansiedad:", "text": "Al enfocarte en '25 minutos de trabajo' en lugar de un proyecto enorme, las tareas parecen menos abrumadoras." }], "info_tips": "Consejos Profesionales para el Éxito", "info_tips_list": ["<strong>Protege Tu Pomodoro:</strong> Si te interrumpen durante una sesión de enfoque, pausa el temporizador o termina el pomodoro. Evita cambiar de contexto.", "<strong>Usa los Descansos Sabiamente:</strong> No hagas nada exigente durante tu descanso. Estírate, toma agua o mira por la ventana. Evita revisar correo electrónico o redes sociales.", "<strong>Adapta los Tiempos:</strong> Aunque 25/5 es la división clásica, siéntete libre de experimentar. Puedes encontrar que 50/10 funciona mejor para ti en ciertas tareas.", "<strong>Combina con una Lista de Tareas:</strong> Usa tu lista de tarefas para decidir en qué trabajar durante cada sesión pomodoro para máxima claridad."], "scroll_down": "Desplázate hacia abajo para aprender más", "language": "Idioma" }
};


// ==========================================================================
// 3. THEME & UI FUNCTIONS
// ==========================================================================

// Applies theme colors based on the current mode (focus, break, etc.).
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



// Toggles between dark and light mode.
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

// Saves the current timer state to localStorage.
const saveTimerState = (state) => localStorage.setItem('focusSprintTimerState', JSON.stringify(state));



// Loads the timer state from localStorage.
const loadTimerState = () => JSON.parse(localStorage.getItem('focusSprintTimerState'));



// Main application state variables.
let currentMode = 'focus';
let endTime = 0;
const timers = { focus: 25 * 60, break: 5 * 60, longBreak: 15 * 60 };
let remainingTimes = { ...timers };
let longBreakSetting = 3;
let longBreakCountdown = 3;



// Creates the cycle indicator dots in the UI.
const renderCycleIndicators = () => {
    cycleIndicator.innerHTML = '';
    for (let i = 0; i < longBreakSetting; i++) {
        const dot = document.createElement('div');
        dot.classList.add('cycle-dot');
        cycleIndicator.appendChild(dot);
    }
    updateCycleIndicators();
};



// Fills the cycle dots based on completed focus sessions.
const updateCycleIndicators = () => {
    const dots = document.querySelectorAll('.cycle-dot');
    const completedCycles = longBreakSetting - longBreakCountdown;
    dots.forEach((dot, index) => {
        dot.classList.toggle('completed', index < completedCycles);
    });
};



// The main timer loop, called every second.
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



// Starts the timer countdown.
function startTimer() {
    const duration = remainingTimes[currentMode];
    if (duration <= 0) return;
    endTime = Date.now() + duration * 1000;
    timerInterval = setInterval(tick, 1000);
    playPauseButton.classList.add('playing');
    updatePlayButton(false);
    saveTimerState({ endTime, currentMode, isRunning: true, longBreakCountdown });
}



// Pauses the timer.
function pauseTimer() {
    clearInterval(timerInterval);
    const timeLeft = Math.round((endTime - Date.now()) / 1000);
    remainingTimes[currentMode] = timeLeft > 0 ? timeLeft : 0;
    playPauseButton.classList.remove('playing');
    updatePlayButton(true);
    saveTimerState({ remainingTime: remainingTimes[currentMode], currentMode, isRunning: false, longBreakCountdown });
}



// Updates the circular progress ring.
const updateProgressRing = (timeLeft, totalTime) => {
    if (totalTime <= 0 || timeLeft < 0) {
        progressRing.style.strokeDashoffset = circumference;
        return;
    }
    const offset = circumference * (1 - (timeLeft / totalTime));
    progressRing.style.strokeDashoffset = offset;
};



// Updates the time display and page title.
const updateTimerDisplay = (time, totalTime) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedTime = `${minutes}:${String(seconds).padStart(2, '0')}`;
    timerDisplay.textContent = formattedTime;
    document.title = `${formattedTime} - ${translations[currentLanguage].app_name}`;
    updateProgressRing(time, totalTime);
};



// Updates the play/pause button's appearance and text.
const updatePlayButton = (isPaused) => {
    playPauseButton.classList.toggle('button--playing', !isPaused);
    updatePlayButtonText();
};



// Resets the current timer to its full duration.
const resetTimer = () => {
    clearInterval(timerInterval);
    remainingTimes[currentMode] = timers[currentMode];
    updateTimerDisplay(remainingTimes[currentMode], timers[currentMode]);
    playPauseButton.classList.remove('playing');
    updatePlayButton(true);
    localStorage.removeItem('focusSprintTimerState');
};



// Skips to the next mode in the Pomodoro cycle.
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
    updatePlayButton(true);

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
        updatePlayButton(true);
        saveTimerState({ remainingTime: remainingTimes[currentMode], currentMode, isRunning: false, longBreakCountdown });
    });
});


// ==========================================================================
// 5. SETTINGS PANEL & NOTIFICATIONS
// ==========================================================================

// Saves the timer's current state before closing settings.
const saveCurrentTimerState = () => {
    const isRunning = playPauseButton.classList.contains('playing');
    if (isRunning) {
        saveTimerState({ endTime, currentMode, isRunning: true, longBreakCountdown });
    } else {
        saveTimerState({ remainingTime: remainingTimes[currentMode], currentMode, isRunning: false, longBreakCountdown });
    }
};



// Saves all user settings to localStorage.
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
    localStorage.setItem('focusSprintSettings', JSON.stringify(settings));
};



// Loads user settings from localStorage on startup.
const loadSettings = () => {
    const savedSettings = JSON.parse(localStorage.getItem('focusSprintSettings'));
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



// Toggles the visibility of the main settings panel.
const showSettingsForm = () => {
    settingsForm.hidden = !settingsForm.hidden;
    if (settingsForm.hidden) {
        saveCurrentTimerState();
    }
};



// Updates a timer's duration, recalculating proportionally if it's running.
const changeTimerDuration = (mode, shouldSave = true) => {
    const oldDuration = timers[mode];
    const inputElement = {
        focus: usersFocusTime,
        break: usersBreakTime,
        longBreak: usersLongBreakTime
    }[mode];
    const defaultValues = { focus: 25, break: 5, longBreak: 15 };
    const newMinutes = inputElement.value || defaultValues[mode];
    const newDuration = newMinutes * 60;
    timers[mode] = newDuration;

    if (currentMode === mode) {
        const isRunning = playPauseButton.classList.contains('playing');
        const timeLeftBeforeChange = isRunning
            ? Math.round((endTime - Date.now()) / 1000)
            : remainingTimes[mode];
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



// Updates the long break interval setting.
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



// Plays the notification sound if enabled.
const playSoundNotification = () => {
    if (soundNotificationInput.checked) {
        soundNotification.currentTime = 0;
        soundNotification.play().catch(e => console.error("Sound play failed:", e));
    }
};



// Sends a desktop notification if enabled and permission is granted.
const sendDesktopNotification = () => {
    if (popUpInput.checked && Notification.permission === 'granted') {
        const title = "Focus Sprint";
        const body = `Time for your ${currentMode} session is up!`;
        new Notification(title, { body });
    }
};



// Asks for permission to send desktop notifications.
const handleNotificationPermission = async (shouldSave = true) => {
    if (!('Notification' in window)) {
        popUpInput.checked = false;
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


// ==========================================================================
// 6. TASKS SECTION LOGIC
// ==========================================================================

// Shows a confirmation modal for destructive actions.
const showConfirmationModal = (title, message) => {
    return new Promise((resolve) => {
        modalTitle.textContent = title;
        modalText.textContent = message;
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



// Toggles the visibility of the tasks settings menu.
const showTasksSettings = () => {
    tasksSettingsForm.hidden = !tasksSettingsForm.hidden;
};



// Deletes all tasks after confirmation.
const deleteAllTasks = async () => {
    if (document.querySelectorAll('.task-item').length > 0) {
        const confirmed = await showConfirmationModal(translations[currentLanguage].delete_all_tasks, translations[currentLanguage].confirm_delete_all);
        if (confirmed) {
            document.querySelectorAll('.task-item').forEach(task => task.remove());
            saveTasks();
        }
    }
    showTasksSettings();
};



// Deletes only completed tasks after confirmation.
const deleteCompletedTasks = async () => {
    if (document.querySelectorAll('.task-item--completed').length > 0) {
        const confirmed = await showConfirmationModal(translations[currentLanguage].delete_completed_tasks, translations[currentLanguage].confirm_delete_completed);
        if (confirmed) {
            document.querySelectorAll('.task-item--completed').forEach(task => task.remove());
            saveTasks();
        }
    }
    showTasksSettings();
};



// Shows or hides completed tasks based on the current setting.
const updateCompletedTasksVisibility = () => {
    document.querySelectorAll('.task-item--completed').forEach(task => {
        task.hidden = areCompletedTasksHidden;
    });
};



// Toggles the setting for hiding/showing completed tasks.
const toggleCompletedTasksVisibility = () => {
    areCompletedTasksHidden = !areCompletedTasksHidden;
    const texts = translations[currentLanguage];
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



// Saves the current list of tasks to localStorage.
const saveTasks = () => {
    const tasks = Array.from(document.querySelectorAll('.task-item')).map(el => ({
        text: el.querySelector('.task-item__text').textContent,
        completed: el.classList.contains('task-item--completed')
    }));
    localStorage.setItem('focusSprintTasks', JSON.stringify(tasks));
};



// Loads tasks from localStorage on startup.
const loadTasks = () => {
    tasksContainer.querySelectorAll('.task-item').forEach(task => task.remove());
    const savedTasks = JSON.parse(localStorage.getItem('focusSprintTasks') || '[]');
    savedTasks.forEach(task => renderTask(task));
    updateCompletedTasksVisibility();
};



// Creates and appends a single task item to the DOM.
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



// Shows the form for creating a new task.
const showTaskCreator = () => {
    addTaskButton.hidden = true;
    taskCreationForm.hidden = false;
    taskInput.focus();
};



// Hides the form for creating a new task.
const hideTaskCreator = () => {
    taskCreationForm.hidden = true;
    addTaskButton.hidden = false;
    taskInput.value = '';
};



// Creates a new task from the input value.
const createTask = () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        renderTask({ text: taskText, completed: false });
        saveTasks();
        hideTaskCreator();
    }
};



// Puts a task item into editing mode.
const enterEditMode = (taskItem) => {
    taskItem.classList.add('task-item--editing');
    taskItem.querySelector('.task-item__edit-input').focus();
};



// Takes a task item out of editing mode.
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



// Event delegation for actions within the tasks container (edit, delete, options).
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
            const texts = translations[currentLanguage];
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



// Closes all open task option menus.
const closeAllMenus = () => {
    document.querySelectorAll('.task-item__menu.active').forEach(menu => menu.classList.remove('active'));
};



// Toggles the visibility of a single task's option menu.
const toggleMenu = (taskItem) => {
    let menu = taskItem.querySelector('.task-item__menu');
    const wasActive = menu && menu.classList.contains('active');
    closeAllMenus();
    if (!menu) {
        const texts = translations[currentLanguage];
        menu = document.createElement('div');
        menu.className = 'task-item__menu';
        menu.innerHTML = `<div class="task-item__menu-option" data-action="edit"><span class="material-symbols-outlined">edit</span> ${texts.edit}</div><div class="task-item__menu-option" data-action="delete"><span class="material-symbols-outlined">delete</span> ${texts.delete}</div>`;
        taskItem.appendChild(menu);
    }
    if (!wasActive) {
        setTimeout(() => menu.classList.add('active'), 10);
    }
};



// Global click listener to close task menus.
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
// 7. LANGUAGE & TRANSLATION
// ==========================================================================

const languageButton = document.querySelector('.js-language-button');
const languageMenu = document.querySelector('.js-language-menu');
const languageOptions = document.querySelectorAll('.js-language-option');
let currentLanguage = 'en';



// Detects the user's browser language.
const detectBrowserLanguage = () => {
    const lang = (navigator.language || navigator.userLanguage).slice(0, 2);
    if (lang === 'pt') return 'pt-BR';
    if (lang === 'es') return 'es';
    return 'en';
};



// Saves the selected language to localStorage.
const saveLanguage = (lang) => localStorage.setItem('focusSprintLanguage', lang);



// Loads the saved language or detects the browser language.
const loadLanguage = () => localStorage.getItem('focusSprintLanguage') || detectBrowserLanguage();



// Updates the active state in the language selection menu.
const updateLanguageMenu = (lang) => {
    languageOptions.forEach(option => option.classList.toggle('active', option.dataset.lang === lang));
};



// Updates the text of the main play/pause button.
const updatePlayButtonText = () => {
    const texts = translations[currentLanguage];
    playPauseButton.textContent = playPauseButton.classList.contains('playing') ? texts.pause : texts.play;
};



// Translates all static text content on the page.
const translateContent = (lang) => {
    const texts = translations[lang];
    document.documentElement.lang = lang.startsWith('pt') ? 'pt-BR' : lang;

    document.querySelector('.js-focus-button').textContent = texts.focus_time;
    document.querySelector('.js-break-button').textContent = texts.break;
    document.querySelector('.js-long-break-button').textContent = texts.long_break;
    document.querySelector('#tasks-heading').textContent = texts.tasks;
    document.querySelector('.js-add-task-button').innerHTML = `<span class="material-symbols-outlined">add</span> ${texts.add_task}`;
    taskInput.placeholder = texts.task_placeholder;
    saveTaskButton.textContent = texts.save;
    cancelTaskButton.textContent = texts.cancel;
    deleteAllTasksButton.querySelector('p').textContent = texts.delete_all_tasks;
    deleteCompletedTasksButton.querySelector('p').textContent = texts.delete_completed_tasks;
    const toggleButton = toggleCompletedTasksButton.querySelector('p');
    toggleButton.textContent = areCompletedTasksHidden ? texts.show_completed_tasks : texts.hide_completed_tasks;
    settingsForm.querySelector('h2').textContent = texts.settings;
    const settingsOptions = settingsForm.querySelectorAll('.settings__section:nth-of-type(1) .settings__options p');
    settingsOptions[0].textContent = texts.auto_start_breaks;
    settingsOptions[1].textContent = texts.auto_start_focus;
    const longBreakP = showLongBreakInterval.parentElement;
    longBreakP.childNodes[0].nodeValue = `${texts.long_break_interval} `;
    longBreakP.childNodes[2].nodeValue = ` ${texts.breaks}`;
    settingsForm.querySelector('.settings__section:nth-of-type(2) > p').textContent = texts.timers;
    const timerLabels = settingsForm.querySelectorAll('.settings__timers--labels');
    timerLabels[0].childNodes[0].nodeValue = `${texts.focus} `;
    timerLabels[1].childNodes[0].nodeValue = `${texts.break_time} `;
    timerLabels[2].childNodes[0].nodeValue = `${texts.long_break_time} `;
    settingsForm.querySelector('.settings__section:nth-of-type(3) > p').textContent = texts.notifications;
    const notificationTexts = settingsForm.querySelectorAll('.settings__notifications--text');
    notificationTexts[0].textContent = texts.sound_alarm;
    notificationTexts[1].textContent = texts.pop_up;
    resetButton.setAttribute('aria-label', texts.reset);
    skipButton.setAttribute('aria-label', texts.skip);
    darkModeToggle.setAttribute('aria-label', texts.dark_mode);
    settingsButton.setAttribute('aria-label', texts.settings_button);
    tasksSettingsButton.setAttribute('aria-label', texts.more_options);
    document.querySelector('.scroll-down-indicator').setAttribute('aria-label', texts.scroll_down);

    updatePlayButtonText();
    updateInfoSection(texts);
};



// Translates the informational cards section.
const updateInfoSection = (texts) => {
    const section = document.querySelector('.info-section');
    if (!section) return;
    section.querySelector('.info-section__title').textContent = texts.info_title;
    const cards = section.querySelectorAll('.info-card');
    cards[0].querySelector('h3').innerHTML = `<span class="material-symbols-outlined">help_outline</span> ${texts.info_what_is}`;
    cards[0].querySelector('p').textContent = texts.info_what_is_text;
    cards[1].querySelector('h3').innerHTML = `<span class="material-symbols-outlined">stacks</span> ${texts.info_how_it_works}`;
    cards[1].querySelectorAll('li span').forEach((span, i) => { span.textContent = texts.info_steps[i]; });
    cards[2].querySelector('h3').innerHTML = `<span class="material-symbols-outlined">thumb_up</span> ${texts.info_why_use}`;
    cards[2].querySelectorAll('.info-card__list--benefits li').forEach((li, i) => {
        const benefit = texts.info_benefits[i];
        li.querySelector('.material-symbols-outlined').textContent = benefit.icon;
        li.querySelector('div').innerHTML = `<strong>${benefit.title}</strong> ${benefit.text}`;
    });
    cards[3].querySelector('h3').innerHTML = `<span class="material-symbols-outlined">school</span> ${texts.info_tips}`;
    cards[3].querySelectorAll('ul li').forEach((li, i) => { li.innerHTML = texts.info_tips_list[i]; });
};



// Changes the application's language.
const changeLanguage = (lang) => {
    currentLanguage = lang;
    saveLanguage(lang);
    updateLanguageMenu(lang);
    translateContent(lang);
    languageMenu.classList.remove('active');
};



// Event listeners for the language menu.
languageButton.addEventListener('click', (e) => {
    e.stopPropagation();
    languageMenu.classList.toggle('active');
});
languageOptions.forEach(option => {
    option.addEventListener('click', () => changeLanguage(option.dataset.lang));
});
document.addEventListener('click', (e) => {
    if (languageMenu.classList.contains('active') && !languageButton.contains(e.target) && !languageMenu.contains(e.target)) {
        languageMenu.classList.remove('active');
    }
});



// Initializes the language on page load.
const initLanguage = () => {
    currentLanguage = loadLanguage();
    updateLanguageMenu(currentLanguage);
    translateContent(currentLanguage);
};


// ==========================================================================
// 8. INITIALIZATION ON PAGE LOAD
// ==========================================================================

// This function runs when the page has finished loading.
document.addEventListener('DOMContentLoaded', () => {
    progressRing.style.strokeDasharray = `${circumference} ${circumference}`;

    // Set up the application in the correct order.
    initLanguage();
    loadSettings();
    loadTasks();
    renderCycleIndicators();

    // Restore the timer state if it exists.
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
                tick();
            } else {
                skipMode();
            }
        } else {
            remainingTimes[currentMode] = savedTimer.remainingTime;
            updateTimerDisplay(savedTimer.remainingTime, timers[currentMode]);
        }
    } else {
        updateTimerDisplay(timers.focus, timers.focus);
    }

    // Set up the animation for the info cards.
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