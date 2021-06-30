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

export default (io) => {
  io.on('connection', (socket) => {
    socket.emit('UPDATE_ROOMS', getAvailableRooms());

    socket.on('CREATE_ROOM', (roomname) => {
      if (existsRoom(roomname)) {
        socket.emit('ROOM_EXISTS');
      } else {
        addRoom(roomname);
        io.emit('UPDATE_ROOMS', getAvailableRooms());
      }
    });
  });
};
