// ---------------------------------------------------------------------------
//
//         APPLIES THE CLASSES TO THE HTML TO KEEP IT LESS CLUTTERED
//
// ---------------------------------------------------------------------------

const calcButtonContainer = document.querySelector('.calc-btn-container');
const calcButtonContainerTwo = document.querySelector(
  '.calc-btn-container-two'
);

const calcButtons = Array.from(calcButtonContainer.children);
const operatorButtons = Array.from(calcButtonContainerTwo.children);

calcButtons.forEach((button) => button.classList.add('calc-btn'));

operatorButtons.forEach((button) => button.classList.add('operator-btn'));

// ---------------------------------------------------------------------------
//
//                          INPUT LOGIC FOR NUMBERS
//
// ---------------------------------------------------------------------------

const firstInput = [];
const secondInput = [];

const isANumber = (number) => parseInt(number) <= 9;

const calcDisplay = document.querySelector('.calc-display');

calcButtons.forEach((calcButton) => {
  calcButton.addEventListener('click', () => {
    if (isANumber(calcButton.textContent)) {
      firstInput.push(calcButton.textContent);
      calcDisplay.textContent = firstInput.join('');
    }
  });
});
