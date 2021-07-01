import { showBlock, hideBlock } from '../../helpers/dom/dom.mjs';

export function hideGamePage() {
  const gamePageBlock = document.getElementById('game-page');
  hideBlock(gamePageBlock);
}

export const showGamePage = () => {
  const gamePageBlock = document.getElementById('game-page');
  showBlock(gamePageBlock);
};
