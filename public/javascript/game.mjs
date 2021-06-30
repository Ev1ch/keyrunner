import {
  clearRooms,
  addRoom,
  hideRoomsPage,
  showRoomsPage,
} from './helpers/dom/rooms.mjs';
import {
  clearPlayers,
  addPlayer,
  hideGamePage,
  showGamePage,
} from './helpers/dom/game.mjs';
import { showBlock, hideBlock } from './helpers/dom/dom.mjs';

const username = sessionStorage.getItem('username');

if (!username) {
  window.location.replace('/login');
}

const credentials = {
  query: {
    username,
  },
};

const loginSocket = io('/login', credentials);

loginSocket.on('USER_EXISTS', () => {
  alert('User with such a name already exists');
  sessionStorage.removeItem('username');
  window.location.replace('/login');
});

const roomsSocket = io('/rooms', credentials);
const addRoomButton = document.getElementById('add-room-btn');

const addRoomHandler = () => {
  const roomName = prompt('Enter room name:');

  roomsSocket.emit('CREATE_ROOM', roomName);
};

addRoomButton.addEventListener('click', addRoomHandler);

roomsSocket.on('UPDATE_ROOMS', (rooms) => {
  clearRooms();
  for (const room of rooms) {
    addRoom(room);
  }
});

roomsSocket.on('ROOM_EXISTS', () => {
  alert('Room with such a name exists');
});

export const joinRoomHandler = (event) => {
  const roomName = event.target.parentElement.getAttribute('data-name');
  roomsSocket.emit('JOIN_ROOM', roomName);
};

roomsSocket.on('JOINED_ROOM', (room) => {
  hideRoomsPage();
  showGamePage();
  clearPlayers();
  for (const player of room.members) {
    if (player.name == username) {
      addPlayer(player, true);
    } else {
      addPlayer(player, false);
    }
  }
});

roomsSocket.on('UPDATE_ROOM', (room) => {
  clearPlayers();
  for (const player of room.members) {
    if (player.name == username) {
      addPlayer(player, true);
    } else {
      addPlayer(player, false);
    }
  }
});

const leftRoomButton = document.getElementById('quit-room-btn');

const leftRoomHandler = (event) => {
  hideGamePage();
  showRoomsPage();
  roomsSocket.emit('LEFT_ROOM');
};

leftRoomButton.addEventListener('click', leftRoomHandler);

const readyButton = document.getElementById('ready-btn');
let playerStatus = 0;

const readyHandler = (event) => {
  if (playerStatus) {
    event.target.innerText = 'Ready';
    showBlock(leftRoomButton);
    roomsSocket.emit('NOT_READY');
    playerStatus = 0;
  } else {
    event.target.innerText = 'Not ready';
    hideBlock(leftRoomButton);
    roomsSocket.emit('READY');
    playerStatus = 1;
  }
};

readyButton.addEventListener('click', readyHandler);
