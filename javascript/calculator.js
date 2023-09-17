/* eslint-disable prefer-const */
// ---------------------------------------------------------------------------
//
//            GETS THE BUTTONS AND CONVERTS THEM TO AN ARRAY
//
// ---------------------------------------------------------------------------

const calcButtonContainer = document.querySelector('.calc-btn-container');
const calcButtonContainerTwo = document.querySelector(
  '.calc-btn-container-two'
);

const calcButtons = Array.from(calcButtonContainer.children);
const operatorButtons = Array.from(calcButtonContainerTwo.children);

// ---------------------------------------------------------------------------
//
//                 INPUT LOGIC (KEYDOWN AND CLICK) FOR NUMBERS
//
// ---------------------------------------------------------------------------

let firstInput = [];
let secondInput = [];
let operatorInput = '';
let invalidOperators;

const calcDisplay = document.querySelector('.calc-display');

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

// -------------------------------------
//      KEYDOWN INPUTS FOR NUMBERS
// -------------------------------------

document.addEventListener('keydown', (e) => {
  const numbers = document.querySelector(`.numbers[data-key="${e.key}"]`);

  if (!numbers) return;

  const number = numbers.textContent;

  handleNumberError();

  checkInvalidOperators();

  // eslint-disable-next-line no-use-before-define
  if (isInputValid(number) && operatorInput === '') {
    firstInput.push(number);
    calcDisplay.textContent = firstInput.join('');

    // eslint-disable-next-line no-use-before-define
  } else if (isInputValid(number) && !invalidOperators) {
    secondInput.push(number);
    calcDisplay.textContent = secondInput.join('');
  }
});

// -------------------------------------
//        CLICK INPUTS FOR NUMBERS
// -------------------------------------

calcButtons.forEach((calcButton, index) => {
  calcButton.addEventListener('click', () => {
    handleNumberError();

    checkInvalidOperators();

    const buttonIndex = calcInputs[index];

    // eslint-disable-next-line no-use-before-define
    if (isInputValid(buttonIndex) && operatorInput === '') {
      firstInput.push(buttonIndex);
      calcDisplay.textContent = firstInput.join('');

      // eslint-disable-next-line no-use-before-define
    } else if (isInputValid(buttonIndex) && !invalidOperators) {
      secondInput.push(buttonIndex);
      calcDisplay.textContent = secondInput.join('');
    }
  });
});

const isInputValid = (number) => {
  if (
    (number >= 0 && number <= 9) ||
    (number === '.' && !firstInput.includes('.') && operatorInput === '')
  ) {
    return number;
  }

  if (
    (number >= 0 && number <= 9) ||
    (number === '.' && !secondInput.includes('.') && operatorInput !== '')
  ) {
    return number;
  }

  return false;
};

// ---------------------------------------------------------------------------
//
//                INPUT LOGIC (KEYDOWN AND CLICK) FOR OPERATORS
//
// ---------------------------------------------------------------------------

const operatorInputs = {
  0: 'root',
  1: 'AC',
  2: '%',
  3: '+/-',
  4: 'X',
  5: '/',
  6: '+',
  7: '-',
  8: '=',
  9: 'C',
};

// -------------------------------------
//      KEYDOWN INPUTS FOR OPERATORS
// -------------------------------------

document.addEventListener('keydown', (e) => {
  const operators = document.querySelector(`.operators[data-key="${e.key}"]`);

  if (!operators) return;

  const operator = operators.dataset.key;

  if (operator === 'Escape' || calcDisplay.textContent === 'ERROR') {
    clearCalculator(operator);
    return;
  }

  checkInvalidOperators();

  clearLastInput(firstInput.length - 1, secondInput.length - 1, operator);

  if (
    (operator !== 'Enter' &&
      operator !== 'Backspace' &&
      firstInput.length > 0 &&
      secondInput.length <= 0) ||
    (invalidOperators && operator !== 'Enter' && operator !== 'Backspace')
  ) {
    operatorInput = operator;
  } else if (
    operator !== 'Backspace' &&
    operatorInput !== '' &&
    secondInput.length > 0 &&
    !invalidOperators
  ) {
    calcDisplay.textContent = calculateInputs(
      Number(firstInput.join('')),
      Number(secondInput.join('')),
      operatorInput
    );

    if (operator !== 'Enter' && operator !== 'Backspace') {
      operatorInput = operator;
    }

    firstInput = [Number(calcDisplay.textContent)];
    secondInput = [];

    handleOperatorError(firstInput);
  }
});

// -------------------------------------
//      CLICK INPUTS FOR OPERATORS
// -------------------------------------

operatorButtons.forEach((operatorButton, index) => {
  operatorButton.addEventListener('click', () => {
    if (index === 1 || calcDisplay.textContent === 'ERROR') {
      clearCalculator(index);
      return;
    }

    checkInvalidOperators();

    clearLastInput(firstInput.length - 1, secondInput.length - 1, index);

    continuedOperations(index);

    operate(index);

    specialOperations(index);
  });
});

function operate(currentIndex) {
  if (
    currentIndex === 8 &&
    firstInput.length > 0 &&
    secondInput.length > 0 &&
    calcDisplay.textContent !== 'ERROR' &&
    !invalidOperators
  ) {
    calcDisplay.textContent = calculateInputs(
      Number(firstInput.join('')),
      Number(secondInput.join('')),
      operatorInput
    );

    firstInput = [Number(calcDisplay.textContent)];
    secondInput = [];

    handleOperatorError(firstInput);
  }
}

function continuedOperations(numberIndex) {
  if (
    ((numberIndex >= 4 && numberIndex <= 7) || numberIndex === 2) &&
    firstInput.length > 0 &&
    secondInput.length <= 0
  ) {
    operatorInput = operatorInputs[numberIndex];
  } else if (
    ((numberIndex >= 4 && numberIndex <= 7) || numberIndex === 2) &&
    secondInput.length > 0 &&
    operatorInput !== '' &&
    !invalidOperators
  ) {
    calcDisplay.textContent = calculateInputs(
      Number(firstInput.join('')),
      Number(secondInput.join('')),
      operatorInput
    );

    operatorInput = operatorInputs[numberIndex];
    firstInput = [Number(calcDisplay.textContent)];
    secondInput = [];

    handleOperatorError(firstInput);
  }
}

function specialOperations(specialIndex) {
  if (
    (specialIndex === 0 && secondInput.length === 0 && firstInput.length > 0) ||
    (specialIndex === 3 && firstInput.length > 0)
  ) {
    operatorInput = operatorInputs[specialIndex];

    calcDisplay.textContent = calculateInputs(
      Number(firstInput.join('')),
      Number(secondInput.join('')),
      operatorInput
    );

    //----------------------------------------------------
    //   HANDLES POSITIVE OR NEGATIVE NUMBER CONVERSION
    //----------------------------------------------------
    if (secondInput.length === 0 && specialIndex === 3) {
      firstInput = [Number(calcDisplay.textContent)];
    } else if (
      secondInput.length > 0 &&
      firstInput.length > 0 &&
      specialIndex === 3
    ) {
      secondInput = [Number(calcDisplay.textContent)];
    }

    //----------------------------------------------------
    //                HANDLES SQUARE ROOT
    //----------------------------------------------------
    else if (specialIndex === 0) {
      firstInput = [Number(calcDisplay.textContent)];
    }
  }

  if (specialIndex !== 0) {
    handleOperatorError(firstInput);
  }
}

// ---------------------------------------------------------------------------
//
//                  FUNCTIONS FOR SOLVING EACH OPERATOR INPUT
//
// ---------------------------------------------------------------------------

function calculateInputs(inputOne, inputTwo, operator) {
  switch (operator) {
    case '+':
      return Number(addInputs(inputOne, inputTwo).toFixed(2));
    case '-':
      return Number(subtractInputs(inputOne, inputTwo).toFixed(2));
    case 'X':
    case '*':
      return Number(multiplyInputs(inputOne, inputTwo).toFixed(2));
    case '/':
      return Number(divideInputs(inputOne, inputTwo).toFixed(7));
    case 'root':
      if (isNaN(Number(squareRootInput(inputOne).toFixed(7)))) {
        return 'ERROR';
      }
      return Number(squareRootInput(inputOne).toFixed(7));
    case '%':
      return Number(percentageInputs(inputOne, inputTwo).toFixed(7));
    case '+/-':
      return Number(positiveOrNegative(inputOne, inputTwo));
    default:
      return console.log('No operator');
  }
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

function squareRootInput(num1) {
  return Math.sqrt(num1);
}

function percentageInputs(num1, num2) {
  return (num1 / 100) * num2;
}

function positiveOrNegative(num1, num2) {
  if (firstInput.length > 0 && secondInput.length === 0) {
    return num1 * -1;
  }
  if (secondInput.length > 0 && firstInput.length > 0) {
    return num2 * -1;
  }
  return 0;
}

// ---------------------------------------------------------------------------
//
//          FUNCTIONS FOR CLEARING THE CALCULATOR AND HANDLING ERRORS
//
// ---------------------------------------------------------------------------

function clearCalculator(acIndex) {
  if (acIndex === 1 || acIndex === 'Escape') {
    firstInput = [];
    secondInput = [];
    operatorInput = '';
    calcDisplay.textContent = 0;
  }
}

function clearLastInput(clearInputOne, clearInputTwo, clearIndex) {
  if (
    firstInput.length > 0 &&
    operatorInput === '' &&
    (clearIndex === 9 || clearIndex === 'Backspace')
  ) {
    firstInput.splice(clearInputOne, 1);
    calcDisplay.textContent = firstInput.join('');
    displayZero();
  } else if (
    secondInput.length > 0 &&
    (clearIndex === 9 || clearIndex === 'Backspace')
  ) {
    secondInput.splice(clearInputTwo, 1);
    calcDisplay.textContent = secondInput.join('');
    displayZero();
  }
}

function displayZero() {
  if (!(firstInput.length > 0) && operatorInput === '') {
    calcDisplay.textContent = 0;
  } else if (!(secondInput.length > 0) && operatorInput !== '') {
    calcDisplay.textContent = 0;
  }
}

function handleOperatorError(totalOver12) {
  if (
    totalOver12.toString().split('').length > 12 ||
    calcDisplay.textContent === 'Infinity' ||
    calcDisplay.textContent === 'NaN'
  ) {
    calcDisplay.textContent = 'ERROR';
  }
}

function handleNumberError() {
  if (
    (firstInput.length >= 12 && operatorInput === '') ||
    secondInput.length >= 12 ||
    calcDisplay.textContent === 'ERROR'
  ) {
    calcDisplay.textContent = 'ERROR';
  }
}

function checkInvalidOperators() {
  invalidOperators = ['root', '+/-'].includes(operatorInput);
}
