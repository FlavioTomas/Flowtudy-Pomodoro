//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------   Variables Section   -------------------------------------------------------------------------------//



// Getting buttons
const focusButton = document.querySelector('.js-focus-button')
const breakButton = document.querySelector('.js-break-button')
const longBreakButton = document.querySelector('.js-long-break-button')
const timerModesButtons = document.querySelectorAll('.button--time-mode')
const body = document.querySelector('.body')
const timerDisplay = document.querySelector('.js-timer-display')
const darkModeToggle = document.querySelector('.js-dark-mode-toggle')
const playPauseButton = document.querySelector('.js-play-pause-button');
const resetButton = document.querySelector('.js-reset-button');
const skipButton = document.querySelector('.js-skip-button')
const settingsButton = document.querySelector('.js-settings-button')
const settingsForm = document.querySelector('.js-settings')
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
    if (body.classList.contains('dark-mode')) {
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
    updateTimerDisplay(focusTime)
    clearInterval(timerInterval)
    focusButton.classList.add('active')
    updatePlayButton(true)
}


// Function with the theme colors of break mode both in light and dark mode
const breakButtonTheme = () => {
    if (body.classList.contains('dark-mode')) {
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
    updateTimerDisplay(breakTime)
    clearInterval(timerInterval)
    breakButton.classList.add('active')
    updatePlayButton(true)
}


// Function with the theme colors of longBreak mode both in light and dark mode
const longBreakButtonTheme = () => {
    if (body.classList.contains('dark-mode')) {
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
    updateTimerDisplay(longBreakTime)
    clearInterval(timerInterval)
    longBreakButton.classList.add('active')
    updatePlayButton(true)
}


// Function with the theme colors of the text both in light and dark mode
const darkModeTheme = () => {
    if (body.classList.contains('dark-mode')) {
        changeBackgroundColor("#e7ffebff");
        rootElement.style.setProperty('--color-text-primary', '#1f1f1fff');
        rootElement.style.setProperty('--color-accent', '#1E2A3A');
        rootElement.style.setProperty('--color-accent-hover', '#374e6bff');
        rootElement.style.setProperty('--color-surface', '#afaeaeff');
        rootElement.style.setProperty('--color-muted', '#000000ff');
        body.classList.remove('dark-mode')
    } else {
        changeBackgroundColor("#1E2A3A")
        rootElement.style.setProperty('--color-text-primary', '#F0F0F0');
        rootElement.style.setProperty('--color-accent', '#00C896');
        rootElement.style.setProperty('--color-accent-hover', '#68dbbe');
        rootElement.style.setProperty('--color-surface', '#162033');
        rootElement.style.setProperty('--color-muted', '#A0AEC0');
        body.classList.add('dark-mode')
    }
    timerModesButtons.forEach(btn => { btn.classList.remove('active') })
    focusButton.classList.add('active')
    updateTimerDisplay(focusTime)
}


//------- Events of theme section -------//


focusButton.addEventListener('click', focusButtonTheme)
breakButton.addEventListener('click', breakButtonTheme)
longBreakButton.addEventListener('click', longBreakButtonTheme)
// Changing between dark and light mode
darkModeToggle.addEventListener('click', darkModeTheme)



//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------   Timers Section   ----------------------------------------------------------------------------------//



// timers amount and turning into seconds
let focusTime = 25
let breakTime = 5
let longBreakTime = 15
let longBreakInterval = 6
focusTime *= 60;
breakTime *= 60;
longBreakTime *= 60;


// Function that plays the timer on focus mode
function focusTimer() {
    if (playPauseButton.classList.contains('playing')) {
        clearInterval(timerInterval)
        playPauseButton.classList.remove('playing')
        updatePlayButton(true)
    } else {
        timerInterval = setInterval(() => {
            focusTime--;

            updateTimerDisplay(focusTime)
        }, 1000);
        playPauseButton.classList.add('playing')
        updatePlayButton(false)
    }
}


// Function that plays the timer on break mode
function breakTimer() {
    if (playPauseButton.classList.contains('playing')) {
        clearInterval(timerInterval)
        playPauseButton.classList.remove('playing')
        updatePlayButton(true)
    } else {
        timerInterval = setInterval(() => {
            breakTime--;

            updateTimerDisplay(breakTime)
        }, 1000);
        playPauseButton.classList.add('playing')
        updatePlayButton(false)
    }
}


// Function that plays the timer on longBreak mode
function longBreakTimer() {
    if (playPauseButton.classList.contains('playing')) {
        clearInterval(timerInterval)
        playPauseButton.classList.remove('playing')
        updatePlayButton(true)
    } else {
        timerInterval = setInterval(() => {
            longBreakTime--;

            updateTimerDisplay(longBreakTime)
        }, 1000);
        playPauseButton.classList.add('playing')
        updatePlayButton(false)
    }
}


// function that update the timer display (to be used in any mode)
const updateTimerDisplay = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedTime = `${minutes}:${String(seconds).padStart(2, '0')}`;
    timerDisplay.textContent = formattedTime;
    document.title = `${formattedTime} - Focus Sprint`;
}


// function that update the play/pause button style (my goal is to use in any mode)
const updatePlayButton = (condition) => {
    if (condition) {
        playPauseButton.textContent = 'Play'
        playPauseButton.classList.remove('button--playing')
    } else {
        playPauseButton.textContent = 'Pause'
        playPauseButton.classList.add('button--playing')
    }
}


// function that resets the timer, both the variable and the display timer
const resetTimer = timer => {
    if (timer === focusTime) {
        focusTime = 25
        focusTime *= 60;
        clearInterval(timerInterval)
        updateTimerDisplay(focusTime)
    } if (timer === breakTime) {
        breakTime = 5
        breakTime *= 60;
        clearInterval(timerInterval)
        updateTimerDisplay(breakTime)
    } if (timer === longBreakTime) {
        longBreakTime = 15
        longBreakTime *= 60;
        clearInterval(timerInterval)
        updateTimerDisplay(longBreakTime)
    }
    updatePlayButton(true)
    playPauseButton.classList.remove('playing')
}


// function to skip to the next mode
const skipMode = () => {
    let skipTo = null
    timerModesButtons.forEach((button, i) => {
        if (button.classList.contains('active')) {
            skipTo = i + 1
            button.classList.remove('active')
        }
    })
    if (skipTo == 3) {
        skipTo = 0
    }
    timerModesButtons.forEach((button, i) => {
        if (skipTo == i) {
            if (button.dataset.mode === 'focus') {
                longBreakInterval--
                focusButtonTheme()
            } else if (button.dataset.mode === 'break') {
                if (longBreakInterval == 0) {
                    longBreakButtonTheme()
                    longBreakInterval = 7
                } else {
                    longBreakInterval--
                    breakButtonTheme()
                }
            } else if (button.dataset.mode === 'longBreak') {
                longBreakInterval--
                focusButtonTheme()
            }
        }
    })
    updatePlayButton(true)
    console.log(longBreakInterval)
}


// Giving a class to the button that is active in the moment 
timerModesButtons.forEach(button => {
    button.addEventListener('click', () => {
        timerModesButtons.forEach(btn => { btn.classList.remove('active') })
        button.classList.add('active')
    })
});


//------- Events of timer section -------//


skipButton.addEventListener('click', skipMode)


// Configuring the correct timer to which mode
playPauseButton.addEventListener('click', () => {
    for (const button of timerModesButtons) {
        if (button.classList.contains('active')) {
            if (button.dataset.mode === 'focus') {
                focusTimer()
            } else if (button.dataset.mode === 'break') {
                breakTimer()
            } else if (button.dataset.mode === 'longBreak') {
                longBreakTimer()
            }
            break
        }
    }
})


// Ensuring that the reset of one mode does not affect the others 
resetButton.addEventListener('click', () => {
    if (focusButton.classList.contains('active')) {
        resetTimer(focusTime)
    } else if (breakButton.classList.contains('active')) {
        resetTimer(breakTime)
    } else if (longBreakButton.classList.contains('active')) {
        resetTimer(longBreakTime)
    }
})



//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------   Forms Section   ----------------------------------------------------------------------------------//




const showSettingsForm = () => {
    settingsForm.classList.toggle('showing-settings');
}



settingsButton.addEventListener('click', showSettingsForm)