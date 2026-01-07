// Getting modes buttons
const focusButton = document.querySelector('.js-focus-button')
const breakButton = document.querySelector('.js-break-button')
const longBreakButton = document.querySelector('.js-long-break-button')
const timerModesButtons = document.querySelectorAll('.button--time-mode')
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

