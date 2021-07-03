import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import socketHandler from './socket';
import routes from './routes';
import { STATIC_PATH, PORT } from './config';

const port = PORT || 3002;

const app = express();
const httpServer = http.Server(app);
const io = socketIO(httpServer);

app.use(express.static(STATIC_PATH));
routes(app);

app.get('*', (req, res) => {
  res.redirect('/login');
});

socketHandler(io);

httpServer.listen(port, () => {
  console.log(`Listen server on port ${port}`);
});
