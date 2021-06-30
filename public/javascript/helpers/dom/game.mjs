import { createBlock } from './dom.mjs';
import { hideBlock, showBlock } from './dom.mjs';

export const hideGamePage = () => {
  const gamePageBlock = document.getElementById('game-page');
  hideBlock(gamePageBlock);
};

export const showGamePage = () => {
  const gamePageBlock = document.getElementById('game-page');
  showBlock(gamePageBlock);
};

const playerTemplate = (user, isYou) => {
  const playerBlock = createBlock('div', {
    class: ['player'],
    attributes: {
      'data-name': user.name,
    },
  });

  const progressBar = createBlock('progress', {
    class: [
      'player__progress-bar',
      'user-progress',
      user.name,
      user.progress == 100 ? 'finished' : 'not-finished',
    ],
    attributes: {
      max: 100,
      value: user.progress,
    },
  });

  const playerName = createBlock('span', {
    class: ['player__name'],
    text: `${user.name} ${isYou ? '(you)' : ''}`,
  });

  const playerStatus = createBlock('div', {
    class: [
      'player__status',
      user.status == 1 ? 'ready-status-green' : 'ready-status-red',
    ],
  });

  playerBlock.appendChild(playerName);
  playerBlock.appendChild(playerStatus);
  playerBlock.appendChild(progressBar);

  return playerBlock;
};

export const addPlayer = (user, isYou) => {
  const playersBlock = document.getElementById('players');
  playersBlock.appendChild(playerTemplate(user, isYou));
};

export const clearPlayers = () => {
  const playersBlock = document.getElementById('players');
  playersBlock.innerHTML = '';
};

export const setText = (text) => {
  const textInput = document.getElementById('not-printed-text');
  textInput.innerText = text;
};

export const clearText = () => {
  document.getElementById('printed-text').innerText = '';
  document.getElementById('next-char').innerText = '';
  document.getElementById('not-printed-text').innerText = '';
};

export const setNotPrintedText = (text) => {
  const textInput = document.getElementById('not-printed-text');
  textInput.innerText = text;
};

export const setNextChar = (char) => {
  const textInput = document.getElementById('next-char');
  textInput.innerText = char;
};

export const setPrintedText = (text) => {
  const textInput = document.getElementById('printed-text');
  textInput.innerText = text;
};

export const setTimer = (seconds) => {
  const timerBlock = document.getElementById('timer');
  timerBlock.innerText = seconds;
};

export const showModal = (winners) => {
  const modalBlock = createBlock('div', { id: 'modal' });
  const modalContentBlock = createBlock('div', {
    id: 'modal-content',
  });

  const modalCloseBlock = createBlock('button', {
    id: 'quit-results-btn',
    text: 'x',
  });

  modalContentBlock.appendChild(modalCloseBlock);

  winners.forEach((winner, index) =>
    modalContentBlock.appendChild(
      createBlock('p', {
        id: `place-${index + 1}`,
        text: `#${index + 1} ${winner.name}`,
      }),
    ),
  );

  modalCloseBlock.addEventListener('click', () => modalBlock.remove());

  modalBlock.appendChild(modalContentBlock);
  document.body.appendChild(modalBlock);
};
