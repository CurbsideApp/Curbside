import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import path from 'path';
import { router } from './router';
import { errorHandler } from './middlewares/error-handler.middleware';
import { authMiddleware } from './middlewares/auth.middleware';

import http from 'http';
import { Server, Socket } from 'socket.io';
import { socketListener } from './chat/socket';
import { CustomError } from './errors/CustomError.class';
import { USER_NOT_AUTHENTICATED } from './errors/SharedErrorMessages';
import { getUserById } from './queries/user.queries';
import { auth } from 'firebase-admin';

dotenv.config({ path: path.resolve(__dirname, `./config/${process.env.NODE_ENV}.env`) });

const PORT = process.env.PORT;

export const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});
app.use(cors());
io.use(async (socket: Socket, next: any) => {
  const token = socket.handshake.auth.token;
  try {
    const fbUser = await auth().verifyIdToken(token);
    const user = await getUserById(fbUser.uid);
    if (user) {
      // @ts-ignore
      socket.user = user;
      next();
    } else {
      next(new CustomError(USER_NOT_AUTHENTICATED, 401));
    }
  } catch (e) {
    console.log('SOCKET HANDSHAKE FAILED');
    next(new CustomError(USER_NOT_AUTHENTICATED, 401));
  }
});
socketListener(io);

app.use(express.json());
app.use(logger('dev'));
app.use(authMiddleware);

app.use('/api', router);
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.use(router);

app.use(errorHandler);
export const server = httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} 🚀`);
});
