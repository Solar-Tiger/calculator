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

const calcDisplay = document.querySelector('.calc-display');

// calcButtons.forEach((calcButton) => {
//   calcButton.addEventListener('click', () => {
//     if (isButtonValid(calcButton.textContent)) {
//       firstInput.push(calcButton.textContent);
//       calcDisplay.textContent = firstInput.join('');
//     }
//   });
// });

calcButtons.forEach((calcButton, index) => {
  calcButton.addEventListener('click', () => {
    const buttonIndex = calcInputs[index];
    // eslint-disable-next-line no-use-before-define
    if (isInputValid(buttonIndex)) {
      firstInput.push(buttonIndex);
      calcDisplay.textContent = firstInput.join('');
    }
  });
});

const isInputValid = (number) => {
  if (number <= 9 || (number === '.' && !firstInput.includes('.'))) {
    return number;
  }

  return false;
};
