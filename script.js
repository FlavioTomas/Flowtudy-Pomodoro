// Getting modes buttons
const focusButton = document.querySelector('.js-focus-button')
const breakButton = document.querySelector('.js-break-button')
const longBreakButton = document.querySelector('.js-long-break-button')
// Getting CSS styles
const rootElement = document.documentElement;
const styles = getComputedStyle(rootElement);
const colorSurface = styles.getPropertyValue('--color-surface')

const changeMode = (button) => {
    button.style.background = colorSurface;
}