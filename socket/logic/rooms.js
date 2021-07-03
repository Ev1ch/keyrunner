import * as config from '../config';
import { getTimer } from '../helpers/timer';
import { texts } from '../../data';
import { Rooms } from '../storage/rooms/rooms';
import { getRandomArrayIndex } from '../helpers/array';
import { getCurrentTime } from '../helpers/time';
import { getSalutPhase } from '../helpers/messages';

export default (io) => {
  io.on('connection', (socket) => {
    const username = socket.handshake.query.username;
    let joinedRoomName;
    let joinedRoom;

    function timerUpdater(seconds, stopper) {
      io.to(joinedRoomName).emit('UPDATE_TIMER', seconds);

      if (joinedRoom.hasFinished()) {
        stopper();
      }
    }

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
      joinedRoom = null;

      io.emit('UPDATE_ROOMS', Rooms.getAvailableRooms());
    });

    socket.on('NOT_READY', () => {
      joinedRoom.setMemberStatus(username, 0);
      io.to(joinedRoomName).emit('UPDATE_ROOM', joinedRoom);
    });

    const pauseTimer = getTimer(
      config.SECONDS_TIMER_BEFORE_START_GAME,
      timerUpdater,
    );

    const gameTimer = getTimer(config.SECONDS_FOR_GAME, timerUpdater);

    socket.on('READY', async () => {
      joinedRoom.setMemberStatus(username, 1);
      io.to(joinedRoomName).emit('UPDATE_ROOM', joinedRoom);

      if (joinedRoom.isReady()) {
        io.to(joinedRoomName).emit(
          'START_TIMER',
          getRandomArrayIndex(texts.length),
        );

        joinedRoom.setStatus(1);

        io.emit('UPDATE_ROOMS', Rooms.getAvailableRooms());

        await pauseTimer.start();

        io.to(joinedRoomName).emit('START_GAME');

        joinedRoom.setStartTime(getCurrentTime());

        await gameTimer.start();

        io.to(joinedRoomName).emit('END_GAME', joinedRoom.getRankList());
        joinedRoom.reset();

        io.to(joinedRoomName).emit('UPDATE_ROOM', joinedRoom);

        io.emit('UPDATE_ROOMS', Rooms.getAvailableRooms());
      }
    });

    socket.on('UPDATE_PROGRESS', (progress) => {
      joinedRoom.setMemberProgress(username, progress);
      joinedRoom.setMemberTime(username, getCurrentTime());
      io.to(joinedRoomName).emit('UPDATE_ROOM', joinedRoom);
    });

    socket.on('disconnect', () => {
      if (joinedRoomName) {
        Rooms.leftRoom(username, joinedRoomName);

        io.to(joinedRoomName).emit('UPDATE_ROOM', joinedRoom);
      }
    });
  });
};
