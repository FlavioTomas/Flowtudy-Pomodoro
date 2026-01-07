// Getting modes buttons
const focusButton = document.querySelector('.js-focus-button')
const breakButton = document.querySelector('.js-break-button')
const longBreakButton = document.querySelector('.js-long-break-button')
const timerModesButtons = document.querySelectorAll('.button--time-mode')
const body = document.querySelector('.body')
const timerDisplay = document.querySelector('.js-timer-display')
// Getting CSS styles
const rootElement = document.documentElement;
const styles = getComputedStyle(rootElement);
const colorSurface = styles.getPropertyValue('--color-surface')
const colorBackground = styles.getPropertyValue('--color-background')


timerModesButtons.forEach(button => {
    button.addEventListener('click', () => {
        timerModesButtons.forEach(btn => {btn.classList.remove('active')})
        button.classList.add('active')
    })
});

focusButton.addEventListener('click', () => {
    body.style.background = "#1E2A3A";
    timerDisplay.innerHTML = '25:00'
})

breakButton.addEventListener('click', () => {
    body.style.background = "#1c5341ff";
    timerDisplay.innerHTML = '5:00'
})

longBreakButton.addEventListener('click', () => {
    body.style.background = "#461935";
    timerDisplay.innerHTML = '15:00'
})