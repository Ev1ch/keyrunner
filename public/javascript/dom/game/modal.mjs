import { createBlock } from '../../helpers/dom/dom.mjs';

export function showModal(winners) {
  const modalBlock = createBlock('div', { id: 'modal' });
  const modalContentBlock = createBlock('div', {
    id: 'modal-content',
  });
  const modalCloseBlock = createBlock('button', {
    id: 'quit-results-btn',
    text: 'x',
  });

  modalContentBlock.appendChild(modalCloseBlock);
  winners.forEach((winner, index) => {
    const player = createBlock('p', {
      id: `place-${index + 1}`,
      text: `#${index + 1} ${winner.name}`,
    });

    modalContentBlock.appendChild(player);
  });
  modalBlock.appendChild(modalContentBlock);
  document.body.appendChild(modalBlock);

  modalCloseBlock.addEventListener('click', () => modalBlock.remove());
}
