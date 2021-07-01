import { Room } from './room';

export const Rooms = {
  rooms: [],

  getAvailableRooms() {
    const availableRooms = this.rooms.filter((room) => room.isAvailable());
    return availableRooms;
  },

  existsRoom(roomname) {
    const existingRoom = this.rooms.find((room) => room.getName() == roomname);
    return existingRoom ? true : false;
  },

  addRoom(roomname) {
    this.rooms.push(new Room(roomname));
  },

  joinRoom(username, roomname) {
    const room = this.getRoom(roomname);
    room.join(username);
  },

  leftRoom(username, roomname) {
    const room = this.getRoom(roomname);
    room.left(username);
  },

  setMemberStatus(username, roomname, status) {
    const room = this.getRoom(roomname);
    const member = room.getMember(username);
    member.setStatus(status);
  },

  getRoom(roomname) {
    const foundRoom = this.rooms.find((room) => room.getName() == roomname);
    return foundRoom;
  },

  isRoomReady(roomname) {
    const room = this.getRoom(roomname);
    return room.isReady();
  },

  hasRoomFinished(roomname) {
    const room = this.getRoom(roomname);
    return room.hasFinished();
  },

  resetRoom(roomname) {
    const room = this.getRoom(roomname);
    room.reset();
  },

  getWinnersList(roomname) {
    const room = this.getRoom(roomname);
    return room.getWinnersList();
  },

  setMemberProgress(username, roomname, progress) {
    const room = this.getRoom(roomname);
    const member = room.getMember(username);
    member.setProgress(progress);
  },

  setMemberTime(username, roomname, time) {
    const room = this.getRoom(roomname);
    const member = room.getMember(username);
    member.setTime(time);
  },

  setRoomStatus(roomname, status) {
    const room = this.getRoom(roomname);
    room.setStatus(status);
  },
};
