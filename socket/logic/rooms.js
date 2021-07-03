import * as config from '../config';
import { getTimer } from '../helpers/timer';
import { texts } from '../../data';
import { Rooms } from '../storage/rooms/rooms';
import { getRandomArrayIndex } from '../helpers/array';
import { getCurrentTime } from '../helpers/time';
import {
  getSalutPhase,
  getStartPhrase,
  getRandomJoke,
  getRandomFact,
  getGoodbyePhrase,
  getStatusPhrase,
  getCloseToFinishPhrase,
  getFinishingPhrase,
} from '../helpers/messages';
import { curry } from 'lodash';

export default (io) => {
  io.on('connection', (socket) => {
    const username = socket.handshake.query.username;
    let joinedRoomName;
    let joinedRoomText;
    let joinedRoom;

    const pauseTimerHandler = curry((seconds, stopper) => {
      io.to(joinedRoomName).emit('UPDATE_TIMER', seconds);
    });

    const gameTimerHandler = curry((seconds, stopper) => {
      io.to(joinedRoomName).emit('UPDATE_TIMER', seconds);

      const delayBeforeStatusMessage = 30;
      const delayBeforeRandomMessage = 10;

      if (joinedRoom.hasFinished()) {
        stopper();
      }

      if (
        seconds % delayBeforeRandomMessage == 0 &&
        seconds % delayBeforeStatusMessage != 0
      ) {
        if (Math.random() < 0.5) {
          sendMessage(getRandomJoke())('joke');
        } else {
          sendMessage(getRandomFact())('fact');
        }
      }

      if (seconds % delayBeforeStatusMessage == 0 && seconds != 60) {
        sendMessage(getStatusPhrase(joinedRoom), 'status');
      }
    });

    const sendMessage = curry((message, type) => {
      io.to(joinedRoomName).emit('COMMENTATOR_MESSAGE', message, type);
    });

    socket.emit('UPDATE_ROOMS', Rooms.getAvailableRooms());

    socket.on('CREATE_ROOM', (roomname) => {
      if (Rooms.existsRoom(roomname)) {
        socket.emit('ROOM_EXISTS');
      } else {
        Rooms.addRoom(roomname);

        Rooms.joinRoom(username, roomname);
        socket.join(roomname);
        joinedRoomName = roomname;
        joinedRoom = Rooms.getRoom(joinedRoomName);

        socket.emit('JOINED_ROOM', joinedRoom);
        io.emit('UPDATE_ROOMS', Rooms.getAvailableRooms());
      }
    });

    socket.on('JOIN_ROOM', (roomname) => {
      Rooms.joinRoom(username, roomname);
      socket.join(roomname);

      joinedRoomName = roomname;
      joinedRoom = Rooms.getRoom(joinedRoomName);

      socket.emit('JOINED_ROOM', joinedRoom);
      io.to(joinedRoomName).emit('UPDATE_ROOM', joinedRoom);
      io.emit('UPDATE_ROOMS', Rooms.getAvailableRooms());
    });

    socket.on('LEFT_ROOM', () => {
      joinedRoom.left(username);
      const roomMembers = joinedRoom.getMembers();

      if (roomMembers.length == 0) {
        Rooms.removeRoom(joinedRoomName);
      } else {
        io.to(joinedRoomName).emit('UPDATE_ROOM', joinedRoom);
      }

      joinedRoomName = '';
      joinedRoomText = '';
      joinedRoom = null;

      io.emit('UPDATE_ROOMS', Rooms.getAvailableRooms());
    });

    socket.on('NOT_READY', () => {
      joinedRoom.setMemberStatus(username, 0);
      io.to(joinedRoomName).emit('UPDATE_ROOM', joinedRoom);
    });

    const pauseTimer = getTimer(
      config.SECONDS_TIMER_BEFORE_START_GAME,
      pauseTimerHandler,
    );

    const gameTimer = getTimer(config.SECONDS_FOR_GAME, gameTimerHandler);

    socket.on('READY', async () => {
      joinedRoom.setMemberStatus(username, 1);
      io.to(joinedRoomName).emit('UPDATE_ROOM', joinedRoom);

      const textId = getRandomArrayIndex(texts.length);
      joinedRoomText = texts[textId];

      if (joinedRoom.isReady()) {
        io.to(joinedRoomName).emit('START_TIMER', textId);

        joinedRoom.setStatus(1);

        io.emit('UPDATE_ROOMS', Rooms.getAvailableRooms());

        io.to(joinedRoomName).emit(
          'COMMENTATOR_MESSAGE',
          getSalutPhase(joinedRoom.getMembers()),
          'salut',
        );

        await pauseTimer.start();

        io.to(joinedRoomName).emit('START_GAME');

        io.to(joinedRoomName).emit(
          'COMMENTATOR_MESSAGE',
          getStartPhrase(),
          'start',
        );

        joinedRoom.setStartTime(getCurrentTime());

        await gameTimer.start();

        sendMessage(getGoodbyePhrase(joinedRoom))('goodbye');

        io.to(joinedRoomName).emit('END_GAME');
        joinedRoom.reset();

        joinedRoomText = '';

        io.to(joinedRoomName).emit('UPDATE_ROOM', joinedRoom);

        io.emit('UPDATE_ROOMS', Rooms.getAvailableRooms());
      }
    });

    let hasCloseToFinishNotified = false;
    let hasFinisingNotified = false;

    socket.on('UPDATE_PROGRESS', (progress, leftChars) => {
      joinedRoom.setMemberProgress(username, progress);
      joinedRoom.setMemberTime(username, getCurrentTime());
      io.to(joinedRoomName).emit('UPDATE_ROOM', joinedRoom);

      if (joinedRoomText.length > 30) {
        if (leftChars < 30 && !hasCloseToFinishNotified) {
          const phrase = getCloseToFinishPhrase(username);
          sendMessage(phrase)('closeToFinish');
          hasCloseToFinishNotified = true;
        } else if (leftChars < 10 && !hasFinisingNotified) {
          const phrase = getFinishingPhrase(username);
          sendMessage(phrase)('finishing');
          hasFinisingNotified = true;
        }
      }
    });

    socket.on('disconnect', () => {
      if (joinedRoomName) {
        joinedRoom.left(username);

        io.to(joinedRoomName).emit('UPDATE_ROOM', joinedRoom);
      }
    });
  });
};
