import * as config from './config';
import login from './routes/login';

export default (io) => {
  login(io.of('/login'));
};
