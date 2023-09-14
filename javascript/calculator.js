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

document.addEventListener('keydown', (e) => {
  const numbers = document.querySelector(`.numbers[data-key="${e.key}"]`);

  if (!numbers) return;

  const number = numbers.textContent;

  if (
    (firstInput.length >= 12 && operatorInput === '') ||
    secondInput.length >= 12 ||
    calcDisplay.textContent === 'ERROR'
  ) {
    calcDisplay.textContent = 'ERROR';

    return;
  }
  if (isInputValid(number) && operatorInput === '') {
    firstInput.push(number);
    calcDisplay.textContent = firstInput.join('');
  } else if (isInputValid(number)) {
    secondInput.push(number);
    calcDisplay.textContent = secondInput.join('');
  }

  console.log(firstInput);
  console.log(secondInput);
  console.log(operatorInput);
});

calcButtons.forEach((calcButton, index) => {
  calcButton.addEventListener('click', () => {
    if (
      (firstInput.length >= 12 && operatorInput === '') ||
      secondInput.length >= 12 ||
      calcDisplay.textContent === 'ERROR'
    ) {
      calcDisplay.textContent = 'ERROR';
      return 0;
    }

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

// -------------------------------------
//          INPUTS FOR OPERATORS
// -------------------------------------

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

document.addEventListener('keydown', (e) => {
  const operators = document.querySelector(`.operators[data-key="${e.key}"]`);

  if (!operators) return;

  const operator = operators.dataset.key;

  if (operator === 'Escape' || calcDisplay.textContent === 'ERROR') {
    clearCalculator();

    return;
  }

  if (
    operator !== 'Enter' &&
    firstInput.length > 0 &&
    secondInput.length <= 0
  ) {
    operatorInput = operator;
  } else if (operator && operatorInput !== '' && secondInput.length > 0) {
    calcDisplay.textContent = calculateInputs(
      Number(firstInput.join('')),
      Number(secondInput.join('')),
      operatorInput
    );

    if (operator !== 'Enter') {
      operatorInput = operator;
    }

    firstInput = [Number(calcDisplay.textContent)];
    secondInput = [];

    handleError(firstInput);
  }

  console.log(firstInput);
  console.log(secondInput);
  console.log(operatorInput);
});

operatorButtons.forEach((operatorButton, index) => {
  operatorButton.addEventListener('click', () => {
    if (index === 1 || calcDisplay.textContent === 'ERROR') {
      clearCalculator();

      return;
    }

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
    calcDisplay.textContent !== 'ERROR'
  ) {
    calcDisplay.textContent = calculateInputs(
      Number(firstInput.join('')),
      Number(secondInput.join('')),
      operatorInput
    );

    firstInput = [Number(calcDisplay.textContent)];
    secondInput = [];

    handleError(firstInput);
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
    operatorInput !== '' &&
    secondInput.length > 0
  ) {
    calcDisplay.textContent = calculateInputs(
      Number(firstInput.join('')),
      Number(secondInput.join('')),
      operatorInput
    );

    operatorInput = operatorInputs[numberIndex];
    firstInput = [Number(calcDisplay.textContent)];
    secondInput = [];

    handleError(firstInput);
  }
}

function specialOperations(specialIndex) {
  if (
    (specialIndex === 0 && secondInput.length === 0 && firstInput.length > 0) ||
    (specialIndex === 3 && firstInput.length > 0)
  ) {
    let otherOperator = operatorInput;

    operatorInput = operatorInputs[specialIndex];

    calcDisplay.textContent = calculateInputs(
      Number(firstInput.join('')),
      Number(secondInput.join('')),
      operatorInput
    );

    // Handles positive or negative number
    if (secondInput.length === 0 && specialIndex === 3) {
      firstInput = [Number(calcDisplay.textContent)];
    } else if (
      secondInput.length > 0 &&
      firstInput.length > 0 &&
      specialIndex === 3
    ) {
      secondInput = [Number(calcDisplay.textContent)];
    }

    // Handles square root
    else if (specialIndex === 0) {
      firstInput = [Number(calcDisplay.textContent)].toString().split('');
    }

    operatorInput = otherOperator;
  }

  handleError(firstInput);
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
//               FUNCTIONS FOR CLEARING THE CALCULATOR AND ERRORS
//
// ---------------------------------------------------------------------------

function clearCalculator() {
  firstInput = [];
  secondInput = [];
  operatorInput = '';
  calcDisplay.textContent = 0;
}

function clearLastInput(clearInputOne, clearInputTwo, clearIndex) {
  if (firstInput.length > 0 && operatorInput === '' && clearIndex === 9) {
    firstInput.splice(clearInputOne, 1);
    calcDisplay.textContent = firstInput.join('');
    displayZero();
  } else if (secondInput.length > 0 && clearIndex === 9) {
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

function handleError(totalOver12) {
  if (
    totalOver12.toString().split(',').length > 12 ||
    calcDisplay.textContent === 'Infinity' ||
    calcDisplay.textContent === 'NaN'
  ) {
    calcDisplay.textContent = 'ERROR';
  }
}

document.addEventListener('click', () => {
  console.log(firstInput);
  console.log(secondInput);
  console.log(operatorInput);
});
