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
//                          INPUT LOGIC FOR BUTTONS
//
// ---------------------------------------------------------------------------

const firstInput = [];
const secondInput = [];
let operatorInput = '';

const calcDisplay = document.querySelector('.calc-display');

// -------------------------------------
//          INPUTS FOR NUMBERS
// -------------------------------------

const calcInputs = {
  9: 1,
  10: 2,
  11: 3,
  6: 4,
  7: 5,
  8: 6,
  3: 7,
  4: 8,
  5: 9,
  12: '0',
  13: '00',
  14: '.',
};

calcButtons.forEach((calcButton, index) => {
  calcButton.addEventListener('click', () => {
    const buttonIndex = calcInputs[index];

    // eslint-disable-next-line no-use-before-define
    if (isInputValid(buttonIndex) && operatorInput === '') {
      firstInput.push(buttonIndex);
      calcDisplay.textContent = firstInput.join('');
    } else if (isInputValid(buttonIndex)) {
      secondInput.push(buttonIndex);
      calcDisplay.textContent = secondInput.join('');
    }
  });
});

const isInputValid = (number) => {
  if (number <= 9 || (number === '.' && !firstInput.includes('.'))) {
    return number;
  }

  return false;
};

// -------------------------------------
//          INPUTS FOR OPERATORS
// -------------------------------------

const operatorInputs = {
  0: '?',
  1: '/',
  2: 'root',
  3: 'X',
  4: '%',
  5: '-',
  6: '+/-',
  7: '+',
};

operatorButtons.forEach((operatorButton, index) => {
  operatorButton.addEventListener('click', () => {
    const operatorIndex = operatorInputs[index];

    operatorInput = operatorIndex;

    console.log(operatorIndex);
  });
});
