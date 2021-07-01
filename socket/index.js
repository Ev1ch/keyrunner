import login from './logic/login';
import rooms from './logic/rooms';

export default (io) => {
  login(io.of('/login'));
  rooms(io.of('/rooms'));
};
