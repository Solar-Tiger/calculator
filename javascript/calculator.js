const calcButtonContainer = document.querySelector('.calc-btn-container');

const calcButtons = Array.from(calcButtonContainer.children);

calcButtons.forEach((button) => button.classList.add('calc-btn'));
