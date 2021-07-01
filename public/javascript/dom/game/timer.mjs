const timerBlock = document.getElementById('timer');
const timerInput = document.getElementById('timer__input');
const timerText = document.getElementById('timer__text');

export function setTimer(seconds) {
  timerInput.innerText = `${seconds} ${seconds == 1 ? 'second' : 'seconds'}`;
}

export function setTimerText(text) {
  timerText.innerText = text;
}
