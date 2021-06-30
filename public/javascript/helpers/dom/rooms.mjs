import { createBlock } from './dom.mjs';

export const clearRooms = () => {
  const roomsBlock = document.getElementById('rooms');
  roomsBlock.innerHTML = '';
};

const roomTemplate = (room) => {
  const roomBlock = createBlock('div', {
    class: ['room'],
    attributes: {
      'data-name': room.name,
    },
  });

  const joinButton = createBlock('button', {
    class: ['room__join-button'],
    text: 'Join room',
  });

  const roomName = createBlock('span', {
    class: ['room__name'],
    text: room.name,
  });

  const usersNumber = createBlock('span', {
    class: ['room__users-number'],
    text: `${room.members.length} ${
      room.members.length == 1 ? 'user' : 'users'
    }`,
  });

  roomBlock.appendChild(usersNumber);
  roomBlock.appendChild(roomName);
  roomBlock.appendChild(joinButton);

  return roomBlock;
};

export const addRoom = (room) => {
  const roomsBlock = document.getElementById('rooms');
  roomsBlock.appendChild(roomTemplate(room));
};