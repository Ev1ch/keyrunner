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
  setText,
  setNextChar,
  setPrintedText,
  setNotPrintedText,
  setTimer,
  clearText,
  showModal,
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

const getText = async (textId) =>
  (await fetch(textsRoute + textId).then((response) => response.json())).text;

const textsRoute = `${window.location.href}/texts/`;

const timerBlock = document.getElementById('timer');

const textBlock = document.getElementById('text-container');

let text;

roomsSocket.on('START_TIMER', async (textId) => {
  text = await getText(textId);
  hideBlock(readyButton);
  showBlock(timerBlock);
});

roomsSocket.on('UPDATE_TIMER', (seconds) => {
  setTimer(seconds);
});

roomsSocket.on('START_GAME', () => {
  setText(text);
  showBlock(textBlock);
  startGame(text);
});

const startGame = (text) => {
  let textToPrint = text;
  const textLength = textToPrint.length;
  let printedText = '';
  let notPrintedText = text;
  let currentPosition = 0;
  let progress = 0;

  const keyUpHandler = (event) => {
    const char = event.key;

    if (char == textToPrint[currentPosition]) {
      currentPosition++;
      printedText += char;
      notPrintedText = textToPrint.substr(currentPosition + 1);
      setNextChar(
        currentPosition != textLength ? textToPrint[currentPosition] : '',
      );
      setPrintedText(printedText);
      setNotPrintedText(notPrintedText);

      progress = Math.round((currentPosition / textLength) * 100);

      roomsSocket.emit('UPDATE_PROGRESS', progress);

      if (progress == 100) {
        const progressBar = document.removeEventListener(
          'keypress',
          keyUpHandler,
        );
      }
    }
  };

  document.addEventListener('keypress', keyUpHandler);
};

roomsSocket.on('END_GAME', (winners) => {
  showModal(winners);
  showBlock(readyButton);
  showBlock(leftRoomButton);
  hideBlock(textBlock);
  clearText();
  hideBlock(timerBlock);
  playerStatus = 0;
  readyButton.innerText = 'Ready';
});
