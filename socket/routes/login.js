const users = [];

const existsUser = (username) => users.find((user) => user.name === username);

const addUser = (username) =>
  users.push({
    name: username,
  });

const removeUser = (username) =>
  users.splice(
    users.findIndex((user) => user.name === username),
    1,
  );

export default (io) => {
  io.on('connection', (socket) => {
    const username = socket.handshake.query.username;

    if (existsUser(username)) {
      socket.emit('USER_EXISTS');
    } else {
      addUser(username);
    }

    socket.on('disconnect', () => {
      removeUser(username);
    });
  });
};
