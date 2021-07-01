import { Users } from '../storage/users/users';

export default (io) => {
  io.on('connection', (socket) => {
    const username = socket.handshake.query.username;

    if (Users.existsUser(username)) {
      socket.emit('USER_EXISTS');
    } else {
      Users.addUser(username);
    }

    socket.on('disconnect', () => {
      Users.removeUser(username);
    });
  });
};
