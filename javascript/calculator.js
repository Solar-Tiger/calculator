/* eslint-disable prefer-const */
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

let firstInput = [];
let secondInput = [];
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

      // eslint-disable-next-line no-use-before-define
    } else if (isInputValid(buttonIndex)) {
      secondInput.push(buttonIndex);
      calcDisplay.textContent = secondInput.join('');
    }
  });
});

const isInputValid = (number) => {
  if (
    number <= 9 ||
    (number === '.' && !firstInput.includes('.') && operatorInput === '')
  ) {
    return number;
  }

  if (
    number <= 9 ||
    (number === '.' && !secondInput.includes('.') && operatorInput !== '')
  ) {
    return number;
  }

  return false;
};

// -------------------------------------
//          INPUTS FOR OPERATORS
// -------------------------------------

const operatorInputs = {
  0: 'root',
  1: '/',
  2: '%',
  3: 'X',
  4: '+/-',
  5: '-',
  6: 'AC',
  7: '+',
};

operatorButtons.forEach((operatorButton, index) => {
  operatorButton.addEventListener('click', () => {
    if (index <= 7 && firstInput.length > 0 && index !== 6) {
      operatorInput = operatorInputs[index];
    } else if (index === 6) {
      clearCalculator();
    } else if (index === 8) {
      clearLastInput(firstInput.length - 1, secondInput.length - 1);
    } else if (secondInput.length > 0) {
      calculateInputs(
        operatorInput,
        Number(firstInput.join('')),
        Number(secondInput.join(''))
      );
    }
  });
});

// ---------------------------------------------------------------------------
//
//                  FUNCTIONS FOR SOLVING EACH OPERATOR INPUT
//
// ---------------------------------------------------------------------------

function calculateInputs(operator, inputOne, inputTwo) {
  switch (operator) {
    case '+':
      calcDisplay.textContent = addInputs(inputOne, inputTwo);
      break;
    case '-':
      calcDisplay.textContent = subtractInputs(inputOne, inputTwo);
      break;
    case 'X':
      calcDisplay.textContent = multiplyInputs(inputOne, inputTwo);
      break;
    case '/':
      calcDisplay.textContent = divideInputs(inputOne, inputTwo);
      break;
    default:
      console.log('No operator');
      return;
  }

  firstInput = [Number(calcDisplay.textContent)];
  secondInput = [];
}

function addInputs(num1, num2) {
  return num1 + num2;
}

function subtractInputs(num1, num2) {
  return num1 - num2;
}

function multiplyInputs(num1, num2) {
  return num1 * num2;
}

function divideInputs(num1, num2) {
  return num1 / num2;
}

// ---------------------------------------------------------------------------
//
//                  FUNCTIONS FOR CLEARING THE CALCULATOR
//
// ---------------------------------------------------------------------------

function clearCalculator() {
  firstInput = [];
  secondInput = [];
  operatorInput = '';
  calcDisplay.textContent = 0;
}

function clearLastInput(clearInputOne, clearInputTwo) {
  if (firstInput.length > 0 && operatorInput === '') {
    firstInput.splice(clearInputOne, 1);
    calcDisplay.textContent = firstInput.join('');
  } else if (secondInput.length > 0) {
    secondInput.splice(clearInputTwo, 1);
    calcDisplay.textContent = secondInput.join('');

    if (!(secondInput.length > 0)) {
      calcDisplay.textContent = 0;
    }
  }
}

document.addEventListener('click', () => {
  console.log(firstInput);
  console.log(secondInput);
  console.log(operatorInput);
});
