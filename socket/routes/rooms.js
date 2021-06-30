import * as config from '../config.js';
import { texts } from '../../data';

const rooms = [];

const getAvailableRooms = () => rooms.filter((room) => isRoomAvailable(room));

const isRoomAvailable = (room) =>
  room.members.length < config.MAXIMUM_USERS_FOR_ONE_ROOM && room.status == 0;

const existsRoom = (roomname) => rooms.find((room) => room.name == roomname);

const addRoom = (roomname) =>
  rooms.push({
    name: roomname,
    status: 0,
    members: [],
  });

const joinRoom = (username, roomname) => {
  const roomIndex = rooms.findIndex((room) => room.name == roomname);
  rooms[roomIndex].members.push({
    name: username,
    progress: 0,
    status: 0,
  });
};

const leftRoom = (username, roomname) => {
  const roomIndex = rooms.findIndex((room) => room.name == roomname);
  const userIndex = rooms[roomIndex].members.findIndex(
    (user) => user.name == username,
  );
  rooms[roomIndex].members.splice(userIndex, 1);
};

const setUserStatus = (username, roomname, status) => {
  const roomIndex = rooms.findIndex((room) => room.name == roomname);
  const userIndex = rooms[roomIndex].members.findIndex(
    (user) => user.name == username,
  );
  rooms[roomIndex].members[userIndex].status = status;
};

const getRoom = (roomname) => rooms.find((room) => room.name == roomname);

const isRoomReady = (roomname) => {
  const roomMembers = rooms.find((room) => room.name == roomname).members;

  return (
    (roomMembers.find((user) => user.status == 0) ? false : true) &&
    roomMembers.length > 1
  );
};

const hasRoomFinished = (roomname) => {
  const roomMembers = rooms.find((room) => room.name == roomname).members;

  return roomMembers.find((user) => user.progress != 100) ? false : true;
};

const resetRoom = (roomname) => {
  const roomIndex = rooms.findIndex((room) => room.name == roomname);
  const roomMember = rooms[roomIndex].members;

  roomMember.forEach((member) => {
    member.status = 0;
    member.progress = 0;
  });

  setRoomStatus(roomname, 0);
};

const getWinnersList = (roomname) => {
  const room = getRoom(roomname);
  const roomMembers = JSON.parse(JSON.stringify(room.members));

  roomMembers.sort((a, b) => {
    if (a.progress == b.progress) {
      return a.time - b.time;
    } else {
      return b.progress - a.progress;
    }
  });

  return roomMembers;
};

const setUserProgress = (username, roomname, progress) => {
  const roomIndex = rooms.findIndex((room) => room.name == roomname);
  const userIndex = rooms[roomIndex].members.findIndex(
    (user) => user.name == username,
  );
  rooms[roomIndex].members[userIndex].progress = progress;
};

const setUserTime = (username, roomname, time) => {
  const roomIndex = rooms.findIndex((room) => room.name == roomname);
  const userIndex = rooms[roomIndex].members.findIndex(
    (user) => user.name == username,
  );
  rooms[roomIndex].members[userIndex].time = time;
};

const setRoomStatus = (roomname, status) => {
  const roomIndex = rooms.findIndex((room) => room.name == roomname);
  rooms[roomIndex].status = status;
};

const getTimer = (seconds, callback) => {
  const timer = {
    timeouts: [],
    start() {
      return new Promise((resolve) => {
        let timeLeft = seconds;

        for (let i = 0; i <= seconds; i++) {
          this.timeouts.push(
            setTimeout(() => {
              callback(timeLeft - i);
            }, i * 1000),
          );
        }

        this.timeouts.push(setTimeout(resolve, seconds * 1000));
      });
    },
    stop() {
      this.timeouts.forEach((timeout) => clearTimeout(timeout));
    },
  };

  return timer;
};

export default (io) => {
  io.on('connection', (socket) => {
    const username = socket.handshake.query.username;
    let joinedRoomName;

    const timerUpdater = (seconds) => {
      io.to(joinedRoomName).emit('UPDATE_TIMER', seconds);
    };

    socket.emit('UPDATE_ROOMS', getAvailableRooms());

    socket.on('CREATE_ROOM', (roomname) => {
      if (existsRoom(roomname)) {
        socket.emit('ROOM_EXISTS');
      } else {
        addRoom(roomname);
        joinRoom(username, roomname);
        socket.join(roomname);
        joinedRoomName = roomname;
        socket.emit('JOINED_ROOM', getRoom(roomname));
        io.emit('UPDATE_ROOMS', getAvailableRooms());
      }
    });

    socket.on('JOIN_ROOM', (roomname) => {
      joinRoom(username, roomname);
      socket.join(roomname);
      joinedRoomName = roomname;

      socket.emit('JOINED_ROOM', getRoom(roomname));
      io.to(joinedRoomName).emit('UPDATE_ROOM', getRoom(roomname));
      io.emit('UPDATE_ROOMS', getAvailableRooms());
    });

    socket.on('LEFT_ROOM', () => {
      leftRoom(username, joinedRoomName);

      io.to(joinedRoomName).emit('UPDATE_ROOM', getRoom(joinedRoomName));
      io.emit('UPDATE_ROOMS', getAvailableRooms());
    });

    socket.on('NOT_READY', () => {
      setUserStatus(username, joinedRoomName, 0);
      io.to(joinedRoomName).emit('UPDATE_ROOM', getRoom(joinedRoomName));
    });

    const pauseTimer = getTimer(
      config.SECONDS_TIMER_BEFORE_START_GAME,
      timerUpdater,
    );

    const gameTimer = getTimer(config.SECONDS_FOR_GAME, timerUpdater);

    socket.on('READY', async () => {
      setUserStatus(username, joinedRoomName, 1);
      io.to(joinedRoomName).emit('UPDATE_ROOM', getRoom(joinedRoomName));

      if (isRoomReady(joinedRoomName)) {
        io.to(joinedRoomName).emit(
          'START_TIMER',
          Math.floor(Math.random() * texts.length),
        );

        setRoomStatus(joinedRoomName, 1);

        io.emit('UPDATE_ROOMS', getAvailableRooms());

        await pauseTimer.start();

        io.to(joinedRoomName).emit('START_GAME');

        await gameTimer.start();

        io.to(joinedRoomName).emit('END_GAME', getWinnersList(joinedRoomName));

        resetRoom(joinedRoomName);

        io.to(joinedRoomName).emit('UPDATE_ROOM', getRoom(joinedRoomName));

        io.emit('UPDATE_ROOMS', getAvailableRooms());
      }
    });

    socket.on('UPDATE_PROGRESS', (progress) => {
      setUserProgress(username, joinedRoomName, progress);
      setUserTime(username, joinedRoomName, new Date().getTime());
      io.to(joinedRoomName).emit('UPDATE_ROOM', getRoom(joinedRoomName));

      if (hasRoomFinished(joinedRoomName)) {
        io.to(joinedRoomName).emit('END_GAME', getWinnersList(joinedRoomName));
        resetRoom(joinedRoomName);
        io.to(joinedRoomName).emit('UPDATE_ROOM', getRoom(joinedRoomName));
        io.emit('UPDATE_ROOMS', getAvailableRooms());
        gameTimer.stop();
      }
    });

    socket.on('disconnect', () => {
      if (joinedRoomName) {
        leftRoom(username, joinedRoomName);

        io.to(joinedRoomName).emit('UPDATE_ROOM', getRoom(joinedRoomName));

        if (
          (getRoom(joinedRoomName).members.length == 1 &&
            getRoom(joinedRoomName).status == 1) ||
          hasRoomFinished(joinedRoomName)
        ) {
          io.to(joinedRoomName).emit(
            'END_GAME',
            getWinnersList(joinedRoomName),
          );

          resetRoom(joinedRoomName);

          io.to(joinedRoomName).emit('UPDATE_ROOM', getRoom(joinedRoomName));
        }
      }
    });
  });
};
