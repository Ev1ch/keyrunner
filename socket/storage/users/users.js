import { User } from './user';

export const Users = {
  users: [],

  existsUser(username) {
    const existingUser = this.users.find((user) => user.getName() == username);
    return existingUser ? true : false;
  },

  addUser(username) {
    this.users.push(new User(username));
  },

  removeUser(username) {
    this.users.splice(
      this.users.findIndex((user) => user.getName() == username),
      1,
    );
  },
};
