import * as config from '../config';
import { getTimer } from '../helpers/timer';
import { texts } from '../../data';
import { Rooms } from '../storage/rooms/rooms';
import { getRandomArrayIndex } from '../helpers/array';

export default (io) => {
  io.on('connection', (socket) => {
    const username = socket.handshake.query.username;
    let joinedRoomName;

    function timerUpdater(seconds, stopper) {
      io.to(joinedRoomName).emit('UPDATE_TIMER', seconds);

      if (Rooms.hasRoomFinished(joinedRoomName)) {
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

        socket.emit('JOINED_ROOM', Rooms.getRoom(roomname));
        io.emit('UPDATE_ROOMS', Rooms.getAvailableRooms());
      }
    });

    socket.on('JOIN_ROOM', (roomname) => {
      Rooms.joinRoom(username, roomname);
      socket.join(roomname);
      joinedRoomName = roomname;

      socket.emit('JOINED_ROOM', Rooms.getRoom(roomname));
      io.to(joinedRoomName).emit('UPDATE_ROOM', Rooms.getRoom(roomname));
      io.emit('UPDATE_ROOMS', Rooms.getAvailableRooms());
    });

    socket.on('LEFT_ROOM', () => {
      Rooms.leftRoom(username, joinedRoomName);

      const room = Rooms.getRoom(joinedRoomName);
      const roomMembers = room.getMembers();

      if (roomMembers.length == 0) {
        Rooms.removeRoom(joinedRoomName);
      } else {
        io.to(joinedRoomName).emit(
          'UPDATE_ROOM',
          Rooms.getRoom(joinedRoomName),
        );
      }

      io.emit('UPDATE_ROOMS', Rooms.getAvailableRooms());
    });

    socket.on('NOT_READY', () => {
      Rooms.setMemberStatus(username, joinedRoomName, 0);
      io.to(joinedRoomName).emit('UPDATE_ROOM', Rooms.getRoom(joinedRoomName));
    });

    const pauseTimer = getTimer(
      config.SECONDS_TIMER_BEFORE_START_GAME,
      timerUpdater,
    );

    const gameTimer = getTimer(config.SECONDS_FOR_GAME, timerUpdater);

    socket.on('READY', async () => {
      Rooms.setMemberStatus(username, joinedRoomName, 1);
      io.to(joinedRoomName).emit('UPDATE_ROOM', Rooms.getRoom(joinedRoomName));

      if (Rooms.isRoomReady(joinedRoomName)) {
        io.to(joinedRoomName).emit(
          'START_TIMER',
          getRandomArrayIndex(texts.length),
        );

        Rooms.setRoomStatus(joinedRoomName, 1);

        const joinedRoom = Rooms.getRoom(joinedRoomName);

        io.emit('UPDATE_ROOMS', Rooms.getAvailableRooms());

        io.to(joinedRoomName).emit('COMMENTATOR_MESSAGE');

        await pauseTimer.start();

        io.to(joinedRoomName).emit('START_GAME');

        await gameTimer.start();

        io.to(joinedRoomName).emit(
          'END_GAME',
          Rooms.getRankList(joinedRoomName),
        );
        Rooms.resetRoom(joinedRoomName);

        io.to(joinedRoomName).emit(
          'UPDATE_ROOM',
          Rooms.getRoom(joinedRoomName),
        );
        io.emit('UPDATE_ROOMS', Rooms.getAvailableRooms());
      }
    });

    socket.on('UPDATE_PROGRESS', (progress) => {
      Rooms.setMemberProgress(username, joinedRoomName, progress);
      Rooms.setMemberTime(username, joinedRoomName, new Date().getTime());
      io.to(joinedRoomName).emit('UPDATE_ROOM', Rooms.getRoom(joinedRoomName));
    });

    socket.on('disconnect', () => {
      if (joinedRoomName) {
        Rooms.leftRoom(username, joinedRoomName);

        io.to(joinedRoomName).emit(
          'UPDATE_ROOM',
          Rooms.getRoom(joinedRoomName),
        );
      }
    });
  });
};
