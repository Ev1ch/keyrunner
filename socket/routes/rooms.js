import * as config from '../config';

const rooms = [];

const getAvailableRooms = () => rooms.filter((room) => isRoomAvailable(room));

const isRoomAvailable = (room) =>
  room.members.length < config.MAXIMUM_USERS_FOR_ONE_ROOM;

const existsRoom = (roomname) => rooms.find((room) => room.name == roomname);

const addRoom = (roomname) =>
  rooms.push({
    name: roomname,
    members: [],
  });

const joinRoom = (username, roomname) => {
  const roomIndex = rooms.findIndex((room) => room.name == roomname);
  rooms[roomIndex].members.push({
    name: username,
    status: 0,
  });
};

const leftRoom = (username, roomname) => {
  const roomIndex = rooms.findIndex((room) => room.name == roomname);
  const userInder = rooms[roomIndex].members.findIndex(
    (user) => user.name == username,
  );
  rooms[roomIndex].members.splice(userInder, 1);
};

const getRoom = (roomname) => rooms.find((room) => room.name == roomname);

export default (io) => {
  io.on('connection', (socket) => {
    const username = socket.handshake.query.username;
    let joinedRoomName;

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

    socket.on('LEFT_ROOM', (roomname) => {
      leftRoom(username, joinedRoomName);

      io.to(joinedRoomName).emit('UPDATE_ROOM', getRoom(joinedRoomName));
      io.emit('UPDATE_ROOMS', getAvailableRooms());
    });

    socket.on('disconnect', () => {
      if (joinedRoomName) {
        leftRoom(username, joinedRoomName);

        io.to(joinedRoomName).emit('UPDATE_ROOM', getRoom(joinedRoomName));
        io.emit('UPDATE_ROOMS', getAvailableRooms());
      }
    });
  });
};
