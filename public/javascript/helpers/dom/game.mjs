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

const playerTemplate = (user) => {
  const playerBlock = createBlock('div', {
    class: ['player'],
    attributes: {
      'data-name': user.name,
    },
  });

  const progressBar = createBlock('progress', {
    class: ['player__progress-bar', 'user-progress', user.name],
    attributes: {
      max: 100,
      value: 0,
    },
  });

  const playerName = createBlock('span', {
    class: ['player__name'],
    text: user.name,
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

export const addPlayer = (user) => {
  const playersBlock = document.getElementById('players');
  playersBlock.appendChild(playerTemplate(user));
};

export const clearPlayers = () => {
  const playersBlock = document.getElementById('players');
  playersBlock.innerHTML = '';
};
