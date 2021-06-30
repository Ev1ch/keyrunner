import login from './routes/login';
import rooms from './routes/rooms';

export default (io) => {
  login(io.of('/login'));
  rooms(io.of('/rooms'));
};
