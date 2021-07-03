import { Room } from './room';

export const Rooms = {
  rooms: [],

  getAvailableRooms() {
    const availableRooms = this.rooms.filter((room) => room.isAvailable());
    return availableRooms;
  },

  existsRoom(roomname) {
    const existingRoom = this.getRoom(roomname);
    return existingRoom ? true : false;
  },

  addRoom(roomname) {
    this.rooms.push(new Room(roomname));
  },

  removeRoom(roomname) {
    const roomIndex = this.rooms.findIndex(
      (room) => room.getName() == roomname,
    );
    this.rooms.splice(roomIndex, 1);
  },

  joinRoom(username, roomname) {
    const room = this.getRoom(roomname);
    room.join(username);
  },

  getRoom(roomname) {
    const foundRoom = this.rooms.find((room) => room.getName() == roomname);
    return foundRoom;
  },
};
