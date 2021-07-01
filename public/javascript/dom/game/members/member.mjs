import { createBlock } from '../../../helpers/dom/dom.mjs';

export function memberTemplate(user, isYou) {
  const memberBlock = createBlock('div', {
    class: ['member'],
    attributes: {
      'data-name': user.name,
    },
  });

  const progressBar = createBlock('progress', {
    class: [
      'member__progress-bar',
      'user-progress',
      user.name,
      user.progress == 100 ? 'finished' : 'not-finished',
    ],
    attributes: {
      max: 100,
      value: user.progress,
    },
  });

  const memberName = createBlock('span', {
    class: ['member__name'],
    text: `${user.name} ${isYou ? '(you)' : ''}`,
  });

  const memberStatus = createBlock('div', {
    class: [
      'member__status',
      user.status == 1 ? 'ready-status-green' : 'ready-status-red',
    ],
  });

  memberBlock.appendChild(memberName);
  memberBlock.appendChild(memberStatus);
  memberBlock.appendChild(progressBar);

  return memberBlock;
}
