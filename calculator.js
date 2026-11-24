import operate from "./utils/operations.js";

/* DOM definition */
const numberKeys = document.querySelectorAll(".number");
const operatorKeys = document.querySelectorAll(".operator");
const cancelBtn = document.querySelector("#cancel-btn");
const deleteBtn = document.querySelector("#delete-btn");
const percentageBtn = document.querySelector("#percentage");
const floatBtn = document.querySelector(".point");
const toggleBtn = document.querySelector(".toggle");
const equalBtn = document.querySelector("#equal");
const expDisplay = document.querySelector(".ex-display span");
const resDisplay = document.querySelector(".res-display span");

// Global variables to store actual operands and operators
let operands = ["0", ""];
let operator = "";

function fitDisplayText(display) {
    const baseFontSize = Number.parseFloat(getComputedStyle(display.parentElement).fontSize);
    const minFontSize = 12;

    display.style.fontSize = `${baseFontSize}px`;
    while (display.scrollWidth > display.clientWidth && Number.parseFloat(display.style.fontSize) > minFontSize) {
        const fontSize = Math.max(minFontSize, Number.parseFloat(display.style.fontSize) - 1);
        display.style.fontSize = `${fontSize}px`;
    }
}

// Update resDisplay for each interaction
function updateDisplay(display, which = "expression") {
    if (which === "expression") display.textContent = `${operands[0]}${operator}${operands[1]}`;
    else display.textContent = which;
    fitDisplayText(display);
}

// Number keys behavior
numberKeys.forEach((numBtn) => {
    numBtn.addEventListener("click", (event) => {
        let num = event.target.textContent;
        if (!operator) {
            if (operands[0] !== "0") operands[0] += num;
            else operands[0] = num;
        }
        else {
            if (operands[1] !== "0") operands[1] += num;
            else operands[1] = num;
        }
        updateDisplay(resDisplay);
    });
});

operatorKeys.forEach((opBtn) => {
    opBtn.addEventListener("click", (event) => {
        const operation = event.target.textContent;
        if (!operands[1] && operands[0]) {
            operator = operation;
            updateDisplay(resDisplay);
        }
        else if (!operands[0]) {
            // do nothing;
        }
        else {
            let result = operate(operands[0], operator, operands[1]);
            updateDisplay(expDisplay);
            operator = operation;
            operands = [result.toString(), ""];
            updateDisplay(resDisplay);
            if (!(typeof result === 'number')) {
                operands[0] = "";
            }
        }
    });
});

equalBtn.addEventListener("click", () => {
    if (operator && operands[1]) {
        let result = operate(operands[0], operator, operands[1]);
        updateDisplay(expDisplay);
        operator = "";
        operands = [result.toString(), ""];
        updateDisplay(resDisplay, `${result}`);
        if (!(typeof result === 'number')) {
            operands[0] = "";
        }
    }
});

cancelBtn.addEventListener("click", () => {
    operands = ["0", ""];
    operator = "";
    updateDisplay(resDisplay);
    updateDisplay(expDisplay, "");
});

deleteBtn.addEventListener("click", () => {
    if (operands[1]) operands[1] = operands[1].substring(0, operands[1].length - 1);
    else if (!operands[1] && operator) operator = "";
    else operands[0] = operands[0].substring(0, operands[0].length - 1);
    if (operands[0] === "") operands[0] = "0";
    updateDisplay(resDisplay);
});

percentageBtn.addEventListener("click", () => {
    operands[1] ? operands[1] = operate(operands[1], "÷", 100).toString() :
    operator ? operator : operands[0] = operate(operands[0], "÷", 100).toString();
    updateDisplay(resDisplay);
});

floatBtn.addEventListener("click", () => {
    if (operands[1] && Number.isInteger(parseFloat(operands[1]))) operands[1] += ".";
    else if (!operands[1] && operator) {}
    else {
        if (Number.isInteger(parseFloat(operands[0]))) operands[0] += ".";
    }
    updateDisplay(resDisplay);
});

toggleBtn.addEventListener("click", () => {
    if (operands[1]) operands[1] = String(-parseFloat(operands[1]));
    else if (!operands[1] && operator) {/*do nothing*/}
    else if (operands[0]) operands[0] = String(-parseFloat(operands[0]));
    updateDisplay(resDisplay);
});

updateDisplay(resDisplay);


