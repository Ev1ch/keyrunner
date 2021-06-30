import { clearRooms, addRoom } from './helpers/dom/rooms.mjs';

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
const addRoomButton = document.getElementById('add-room-button');

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
