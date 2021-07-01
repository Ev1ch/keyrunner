const timerBlock = document.getElementById('timer');
const timerInput = document.getElementById('timer__input');

export function setTimer(seconds) {
  timerInput.innerText = seconds;
}
