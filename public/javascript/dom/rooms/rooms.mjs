import { createBlock } from '../../helpers/dom/dom.mjs';
import { joinRoomHandler } from '../../logic/socket/rooms.mjs';

const roomsBlock = document.getElementById('rooms');

function roomTemplate(room) {
  const roomBlock = createBlock('div', {
    class: ['room'],
    attributes: {
      'data-name': room.name,
    },
  });

  const joinButton = createBlock('button', {
    class: ['room__join-button', 'join-btn'],
    text: 'Join room',
  });

  joinButton.addEventListener('click', joinRoomHandler);

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
}

export const clearRooms = () => {
  roomsBlock.innerHTML = '';
};

export function addRoom(room) {
  roomsBlock.appendChild(roomTemplate(room));
}
