const printedInput = document.getElementById('printed-text');
const notPrintedInput = document.getElementById('not-printed-text');
const nextCharInput = document.getElementById('next-char');

export function setText(text) {
  notPrintedInput.innerText = text;
}

export function clearText() {
  printedInput.innerText = '';
  nextCharInput.innerText = '';
  notPrintedInput.innerText = '';
}

export function setNotPrintedText(text) {
  notPrintedInput.innerText = text;
}

export function setNextChar(char) {
  nextCharInput.innerText = char;
}

export function setPrintedText(text) {
  printedInput.innerText = text;
}
