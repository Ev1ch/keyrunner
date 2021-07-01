import { showBlock, hideBlock } from '../../helpers/dom/dom.mjs';

const roomsPageBlock = document.getElementById('rooms-page');

export function hideRoomsPage() {
  hideBlock(roomsPageBlock);
}

export function showRoomsPage() {
  showBlock(roomsPageBlock);
}
