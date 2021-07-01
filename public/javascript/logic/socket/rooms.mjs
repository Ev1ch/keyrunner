import { clearRooms, addRoom } from '../../dom/rooms/rooms.mjs';
import { showRoomsPage, hideRoomsPage } from '../../dom/rooms/roomsPage.mjs';
import { clearMembers, addMember } from '../../dom/game/members/members.mjs';
import { showGamePage, hideGamePage } from '../../dom/game/gamePage.mjs';
import { showModal } from '../../dom/game/modal.mjs';
import {
  setText,
  clearText,
  setNotPrintedText,
  setNextChar,
  setPrintedText,
} from '../../dom/game/text.mjs';
import { setTimer, setTimerText } from '../../dom/game/timer.mjs';
import { getText } from '../../helpers/api/api.mjs';
import { hideBlock, showBlock } from '../../helpers/dom/dom.mjs';

const username = sessionStorage.getItem('username');
const credentials = {
  query: {
    username,
  },
};
let playerStatus = 0;

const roomsSocket = io('/rooms', credentials);

const addRoomButton = document.getElementById('add-room-btn');
const leftRoomButton = document.getElementById('quit-room-btn');
const readyButton = document.getElementById('ready-btn');
const timerBlock = document.getElementById('timer');
const textBlock = document.getElementById('text-container');

function addRoomHandler() {
  const roomName = prompt('Enter room name:');
  roomsSocket.emit('CREATE_ROOM', roomName);
}

function leftRoomHandler() {
  hideGamePage();
  showRoomsPage();
  roomsSocket.emit('LEFT_ROOM');
}

export function joinRoomHandler(event) {
  const roomName = event.target.parentElement.getAttribute('data-name');
  roomsSocket.emit('JOIN_ROOM', roomName);
}

function readyHandler(event) {
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
}

readyButton.addEventListener('click', readyHandler);
addRoomButton.addEventListener('click', addRoomHandler);
leftRoomButton.addEventListener('click', leftRoomHandler);

let text;

roomsSocket.on('UPDATE_ROOMS', (rooms) => {
  clearRooms();
  for (const room of rooms) {
    addRoom(room);
  }
});

roomsSocket.on('ROOM_EXISTS', () => {
  alert('Room with such a name exists');
});

roomsSocket.on('JOINED_ROOM', (room) => {
  hideRoomsPage();
  showGamePage();
  clearMembers();
  for (const player of room.members) {
    if (player.name == username) {
      addMember(player, true);
    } else {
      addMember(player, false);
    }
  }
});

roomsSocket.on('UPDATE_ROOM', (room) => {
  clearMembers();
  for (const player of room.members) {
    if (player.name == username) {
      addMember(player, true);
    } else {
      addMember(player, false);
    }
  }
});

roomsSocket.on('START_TIMER', async (textId) => {
  text = await getText(textId);
  hideBlock(readyButton);
  showBlock(timerBlock);
});

roomsSocket.on('UPDATE_TIMER', (seconds) => {
  setTimer(seconds);
});

roomsSocket.on('START_GAME', () => {
  setTimerText('Game:');
  setText(text);
  showBlock(textBlock);
  startGame(text);
});

roomsSocket.on('END_GAME', (winners) => {
  showModal(winners);
  showBlock(readyButton);
  showBlock(leftRoomButton);
  hideBlock(textBlock);
  clearText();
  hideBlock(timerBlock);
  setTimerText('Pause:');
  setTimer('Game not started');
  playerStatus = 0;
  readyButton.innerText = 'Ready';
});

function startGame(text) {
  let textToPrint = text;
  const textLength = textToPrint.length;
  let printedText = '';
  let notPrintedText = text;
  let currentPosition = 0;
  let progress = 0;

  function keyUpHandler(event) {
    const char = event.key;

    if (char == textToPrint[currentPosition]) {
      currentPosition++;
      printedText += char;
      notPrintedText = textToPrint.substr(currentPosition + 1);
      setNextChar(
        currentPosition < textLength ? textToPrint[currentPosition] : '',
      );
      setPrintedText(printedText);
      setNotPrintedText(notPrintedText);

      progress = Math.round((currentPosition / textLength) * 100);

      roomsSocket.emit('UPDATE_PROGRESS', progress);

      if (progress == 100) {
        document.removeEventListener('keypress', keyUpHandler);
      }
    }
  }

  document.addEventListener('keypress', keyUpHandler);
}

// export * from './rooms';
