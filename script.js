// Getting modes buttons
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
// Getting CSS styles
const rootElement = document.documentElement;
const styles = getComputedStyle(rootElement);
const colorSurface = styles.getPropertyValue('--color-surface')
const colorBackground = styles.getPropertyValue('--color-background')

// changing the appearance of the timer mode buttons according to the mode
timerModesButtons.forEach(button => {
    button.addEventListener('click', () => {
        timerModesButtons.forEach(btn => { btn.classList.remove('active') })
        button.classList.add('active')
    })
});

// Changing the background color and the timer display value according to the mode
function changeBackgroundColor(newColor) {
    rootElement.style.setProperty('--color-background', newColor);
}
focusButton.addEventListener('click', () => {
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
    timerDisplay.innerHTML = '25:00'
})
breakButton.addEventListener('click', () => {
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
    timerDisplay.innerHTML = '5:00'
})
longBreakButton.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        changeBackgroundColor("#461935")
        rootElement.style.setProperty('--color-accent', '#b82f83ff');
        rootElement.style.setProperty('--color-accent-hover', '#f53fafff');
        rootElement.style.setProperty('--color-surface', '#2c0c20ff');
    } else {
        changeBackgroundColor("#d776e4ff")
        rootElement.style.setProperty('--color-accent', '#240129ff');
        rootElement.style.setProperty('--color-accent-hover', '#480052ff');
        rootElement.style.setProperty('--color-surface', '#a053aaff');
    }
    timerDisplay.innerHTML = '15:00'
})

// Changing between dark and light mode
darkModeToggle.addEventListener('click', () => {
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
    timerDisplay.innerHTML = '25:00'
})


let focusTime = 25
let breakTime = 5
let longBreakTime = 15
focusTime *= 60;
breakTime *= 60;
longBreakTime *= 60;


function focusTimer() {
    if (playPauseButton.classList.contains('playing')) {
        clearInterval(timerInterval)
        playPauseButton.classList.remove('playing')
    } else {
        timerInterval = setInterval(() => {
            focusTime--;

            updateTimerDisplay(focusTime)
        }, 1000);
        playPauseButton.classList.add('playing')
    }
}

const updateTimerDisplay = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    formattedTime = `${minutes}:${String(seconds).padStart(2, '0')}`;
    timerDisplay.textContent = formattedTime;
    document.title = `${formattedTime} - Focus Sprint`;
}



playPauseButton.addEventListener('click', focusTimer)




