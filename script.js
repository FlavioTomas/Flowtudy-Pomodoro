//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------   Variables Section   -------------------------------------------------------------------------------//




// Getting buttons
const focusButton = document.querySelector('.js-focus-button')
const breakButton = document.querySelector('.js-break-button')
const longBreakButton = document.querySelector('.js-long-break-button')
const timerModesButtons = document.querySelectorAll('.button--time-mode')
const mainContainer = document.querySelector('.main-container')
const timerDisplay = document.querySelector('.js-timer-display')
const darkModeToggle = document.querySelector('.js-dark-mode-toggle')
const playPauseButton = document.querySelector('.js-play-pause-button');
const resetButton = document.querySelector('.js-reset-button');
const skipButton = document.querySelector('.js-skip-button')
const settingsButton = document.querySelector('.js-settings-button')
const settingsForm = document.querySelector('.js-settings')
const usersFocusTime = document.querySelector('.js-settings__numbers-input--focus')
const usersBreakTime = document.querySelector('.js-settings__numbers-input--break')
const usersLongBreakTime = document.querySelector('.js-settings__numbers-input--long-break')
const usersLongBreakInterval = document.querySelector('.js-settings__options--long-break-interval')
const showLongBreakInterval = document.querySelector('.js-settings__options--long-break-interval--text')
const breaksAutoStartInput = document.querySelector('.js-settings__options--breaks-auto-starts-input')
const focusAutoStartInput = document.querySelector('.js-settings__options--focus-auto-start-input')
const soundNotificationInput = document.querySelector('.js-settings__notifications--sound-switch-input')
const soundNotification = document.getElementById('sound-notification')
const popUpInput = document.querySelector('.js-settings__notifications--pop-up-switch-input')
// Getting CSS styles
const rootElement = document.documentElement;
const styles = getComputedStyle(rootElement);
const colorSurface = styles.getPropertyValue('--color-surface')
const colorBackground = styles.getPropertyValue('--color-background')
// setting timerInterval variable so skipButton won't bug
let timerInterval = null




//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------   Themes Section   ----------------------------------------------------------------------------------//




// Changing the background color and the timer display value according to the mode
function changeBackgroundColor(newColor) {
    rootElement.style.setProperty('--color-background', newColor);
}


// Function with the theme colors of focus mode both in light and dark mode
const focusButtonTheme = () => {
    if (mainContainer.classList.contains('dark-mode')) {
        changeBackgroundColor("#1E2A3A")
        rootElement.style.setProperty('--color-accent', '#00C896');
        rootElement.style.setProperty('--color-accent-hover', '#68dbbe');
        rootElement.style.setProperty('--color-surface', '#162033');
    } else {
        changeBackgroundColor("#e7ffebff");
        rootElement.style.setProperty('--color-accent', '#1E2A3A');
        rootElement.style.setProperty('--color-accent-hover', '#374e6bff');
        rootElement.style.setProperty('--color-surface', '#afaeaeff');
    }
    updateTimerDisplay(timers.focus)
    clearInterval(timerInterval)
    focusButton.classList.add('active')
    updatePlayButton(true)
}


// Function with the theme colors of break mode both in light and dark mode
const breakButtonTheme = () => {
    if (mainContainer.classList.contains('dark-mode')) {
        changeBackgroundColor("#0f2e24ff")
        rootElement.style.setProperty('--color-accent', '#52d864ff');
        rootElement.style.setProperty('--color-accent-hover', '#61ff76ff');
        rootElement.style.setProperty('--color-surface', '#062018ff');
    } else {
        changeBackgroundColor("#4fe9b5ff")
        rootElement.style.setProperty('--color-accent', '#002712ff');
        rootElement.style.setProperty('--color-accent-hover', '#004721ff');
        rootElement.style.setProperty('--color-surface', '#3ea381ff');
    }
    updateTimerDisplay(timers.break)
    clearInterval(timerInterval)
    breakButton.classList.add('active')
    updatePlayButton(true)
}


// Function with the theme colors of longBreak mode both in light and dark mode
const longBreakButtonTheme = () => {
    if (mainContainer.classList.contains('dark-mode')) {
        changeBackgroundColor("#461935")
        rootElement.style.setProperty('--color-accent', '#b82f83ff');
        rootElement.style.setProperty('--color-accent-hover', '#f53fafff');
        rootElement.style.setProperty('--color-surface', '#2c0c20ff');
    } else {
        changeBackgroundColor("rgb(238, 159, 248)")
        rootElement.style.setProperty('--color-accent', '#240129ff');
        rootElement.style.setProperty('--color-accent-hover', '#480052ff');
        rootElement.style.setProperty('--color-surface', '#a053aaff');
    }
    updateTimerDisplay(timers.longBreak)
    clearInterval(timerInterval)
    longBreakButton.classList.add('active')
    updatePlayButton(true)
}


// Function with the theme colors of the text both in light and dark mode
const darkModeTheme = () => {
    if (mainContainer.classList.contains('dark-mode')) {
        changeBackgroundColor("#e7ffebff");
        rootElement.style.setProperty('--color-text-primary', '#1f1f1fff');
        rootElement.style.setProperty('--color-accent', '#1E2A3A');
        rootElement.style.setProperty('--color-accent-hover', '#374e6bff');
        rootElement.style.setProperty('--color-surface', '#afaeaeff');
        rootElement.style.setProperty('--color-muted', '#000000ff');
        mainContainer.classList.remove('dark-mode')
    } else {
        changeBackgroundColor("#1E2A3A")
        rootElement.style.setProperty('--color-text-primary', '#F0F0F0');
        rootElement.style.setProperty('--color-accent', '#00C896');
        rootElement.style.setProperty('--color-accent-hover', '#68dbbe');
        rootElement.style.setProperty('--color-surface', '#162033');
        rootElement.style.setProperty('--color-muted', '#A0AEC0');
        mainContainer.classList.add('dark-mode')
    }
    timerModesButtons.forEach(btn => { btn.classList.remove('active') })
    focusButton.classList.toggle('active')
    updateTimerDisplay(timers.focus)
}


//------- Events of theme section -------//


focusButton.addEventListener('click', focusButtonTheme)
breakButton.addEventListener('click', breakButtonTheme)
longBreakButton.addEventListener('click', longBreakButtonTheme)
// Changing between dark and light mode
darkModeToggle.addEventListener('click', darkModeTheme)




//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------   Timers Section   ----------------------------------------------------------------------------------//




// --- Variables to control the timers ---
let currentMode = 'focus'; // Saves the active mode ('focus', 'break', 'longBreak')
let endTime = 0;           // Saves the exact timestamp of when should end


// All the timers in an object to easy use
const timers = {
    focus: 25 * 60,
    break: 5 * 60,
    longBreak: 15 * 60
};



let remainingTimes = { ...timers };


// The initial time values
let focusTime = timers.focus;
let breakTime = timers.break;
let longBreakTime = timers.longBreak;
let longBreakInterval = 6;


// Function to make the timer precise
function tick() {
    // Calculates the actual remaining time in seconds
    const timeLeft = Math.round((endTime - Date.now()) / 1000);

    // if the time runs out, clear the interval and skip to the next mode.
    if (timeLeft < 0) {
        clearInterval(timerInterval);
        playSoundNotification(soundNotificationOptions);
        showPopUp(popUpOptions)
        skipMode(breaksAutoStart, focusAutoStart);
        return;
    }
    updateTimerDisplay(timeLeft);
}


// Function to make the timer run
function startTimer() {
    const duration = remainingTimes[currentMode];

    if (duration <= 0) return;

    // Calculates the final timestamp.
    endTime = Date.now() + duration * 1000;

    // Starts the setInterval to run the 'tick' function every second.
    timerInterval = setInterval(tick, 1000);

    playPauseButton.classList.add('playing');
    updatePlayButton(false);
}


// Function to stop the timer
function pauseTimer() {
    clearInterval(timerInterval);

    // Saves exactly how much time was left when you paused.
    const timeLeft = Math.round((endTime - Date.now()) / 1000);
    remainingTimes[currentMode] = timeLeft > 0 ? timeLeft : 0;

    playPauseButton.classList.remove('playing');
    updatePlayButton(true);
}


// --- Interface Functions ---


// Function to update the stopwatch in the screen
const updateTimerDisplay = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedTime = `${minutes}:${String(seconds).padStart(2, '0')}`;
    timerDisplay.textContent = formattedTime;
    document.title = `${formattedTime} - Focus Sprint`;
};


// Function to alternate between the play and pause
const updatePlayButton = (isPaused) => {
    playPauseButton.textContent = isPaused ? 'PLAY' : 'PAUSE';
    playPauseButton.classList.toggle('button--playing', !isPaused);
};


// Function to reset the timer
const resetTimer = () => {
    clearInterval(timerInterval);
    remainingTimes[currentMode] = timers[currentMode]; // Reset the remaining time.
    updateTimerDisplay(remainingTimes[currentMode]);
    playPauseButton.classList.remove('playing');
    updatePlayButton(true);
};


// Function to skip to the next mode
const skipMode = (breakAutoStart, focusAutoStart) => {
    clearInterval(timerInterval);
    playPauseButton.classList.remove('playing');
    updatePlayButton(true);

    const currentActiveButton = document.querySelector('.button--time-mode.active');
    let currentIndex = Array.from(timerModesButtons).indexOf(currentActiveButton);

    timerModesButtons.forEach(btn => btn.classList.remove('active'));
    let nextIndex = (currentIndex + 1) % timerModesButtons.length;

    // Logic for the Long Break Interval
    if (longBreakInterval == 0) {
        nextIndex = 2;
        longBreakInterval = usersLongBreakInterval.value == '' ? 7 : (usersLongBreakInterval.value * 2) + 1;
    } else {
        longBreakInterval--
        if (nextIndex == 2) {
            nextIndex = 0
        }
    }


    const nextButton = timerModesButtons[nextIndex];
    currentMode = nextButton.dataset.mode; // Updates the current mode

    // Calls the corresponding theme function
    if (currentMode === 'focus') focusButtonTheme();
    if (currentMode === 'break') breakButtonTheme();
    if (currentMode === 'longBreak') longBreakButtonTheme();

    // If autoStart is enabled, it starts the next timer
    if (breakAutoStart == 'on' && (currentMode == 'break' || currentMode === 'longBreak')) {
        startTimer();
    }
    if (focusAutoStart == 'on' && currentMode == 'focus') {
        startTimer();
    }
};



// --- Timer Section Events ---



playPauseButton.addEventListener('click', () => {
    if (playPauseButton.classList.contains('playing')) {
        pauseTimer();
    } else {
        startTimer();
    }
});
resetButton.addEventListener('click', resetTimer);
skipButton.addEventListener('click', () => skipMode(breaksAutoStart, focusAutoStart));
timerModesButtons.forEach(button => {
    button.addEventListener('click', () => {
        // If a timer is running, save the progress before switching.
        if (playPauseButton.classList.contains('playing')) {
            const timeLeft = Math.round((endTime - Date.now()) / 1000);
            remainingTimes[currentMode] = timeLeft > 0 ? timeLeft : 0;
        }

        clearInterval(timerInterval);
        timerModesButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentMode = button.dataset.mode;
        updateTimerDisplay(remainingTimes[currentMode]);
        playPauseButton.classList.remove('playing');
        updatePlayButton(true);
    });
});





//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------   Settings Section   ----------------------------------------------------------------------------------//




let breaksAutoStart = 'off'
let focusAutoStart = 'off'
let soundNotificationOptions = 'off'
let popUpOptions = 'off'



const showSettingsForm = () => {
    settingsForm.classList.toggle('showing-settings');
    if (!playPauseButton.classList.contains('playing')) {
        timerModesButtons.forEach(button => {
            if (button.classList.contains('active')) {
                button.dataset.mode == 'focus' ? updateTimerDisplay(remainingTimes.focus) : button.dataset.mode == 'break' ? updateTimerDisplay(remainingTimes.break) : updateTimerDisplay(remainingTimes.longBreak)
            }
        })
    }
}



const changeFocusTime = () => {
    const newTime = usersFocusTime.value || 25;
    timers.focus = newTime * 60;
    remainingTimes.focus = newTime * 60

    if (currentMode === 'focus') {
        updateTimerDisplay(timers.focus);
    }
}



const changeBreakTime = () => {
    const newTime = usersBreakTime.value || 5;
    timers.break = newTime * 60;
    remainingTimes.break = newTime * 60;

    if (currentMode === 'break') {
        updateTimerDisplay(timers.break);
    }
}



const changeLongBreakTime = () => {
    const newTime = usersLongBreakTime.value || 15;
    timers.longBreak = newTime * 60;
    remainingTimes.longBreak = newTime * 60;

    if (currentMode === 'longBreak') {
        updateTimerDisplay(timers.longBreak);
    }
}



const changeLongBreakInterval = () => {
    longBreakInterval = usersLongBreakInterval.value * 2
    showLongBreakInterval.innerHTML = String(usersLongBreakInterval.value)
}



const changeBreaksAutoStart = () => {
    breaksAutoStart = breaksAutoStart == 'on' ? 'off' : 'on'
}



const changeFocusAutoStart = () => {
    focusAutoStart = focusAutoStart == 'on' ? 'off' : 'on'
}



const playSoundNotification = verification => {
    if (verification == 'on') {
        soundNotification.currentTime = 0;
        soundNotification.play();
    }
}



const changeSoundNotificationOptions = () => {
    soundNotificationOptions = soundNotificationOptions == 'on' ? 'off' : 'on'
}



const showPopUp = verification => {
    if (verification == 'on') {
        alert('Time Finished')
    }
}




const changePopUpOptions = () => {
    popUpOptions = popUpOptions == 'on' ? 'off' : 'on'
}




settingsButton.addEventListener('click', showSettingsForm)
usersFocusTime.addEventListener('change', changeFocusTime)
usersBreakTime.addEventListener('change', changeBreakTime)
usersLongBreakTime.addEventListener('change', changeLongBreakTime)
mainContainer.addEventListener('click', (event) => {
    if (!settingsButton.contains(event.target) && !settingsForm.contains(event.target) && settingsForm.classList.contains('showing-settings') && !darkModeToggle.contains(event.target)) {
        showSettingsForm()
    }
})
usersLongBreakInterval.addEventListener('change', changeLongBreakInterval)
breaksAutoStartInput.addEventListener('change', changeBreaksAutoStart)
focusAutoStartInput.addEventListener('change', changeFocusAutoStart)
soundNotificationInput.addEventListener('change', changeSoundNotificationOptions)
popUpInput.addEventListener('change', changePopUpOptions)