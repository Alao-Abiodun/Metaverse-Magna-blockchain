import { Server } from 'socket.io';
import { jwtMiddleware } from '../middlewares/authorization/socket.authorization';
import { trackAndStreamTransactions } from './blocktransaction';
 
export default (app: Express.Application) => {
    try {
        const io = new Server(app, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
            path: '/api/v1',
        });

        io.on('connection', (socket) => {
            console.log('A metaverse magnet connected to websocket')
        });

        // io.use(jwtMiddleware);

        // trackAndStreamTransactions(io);
    } catch (error) {
        console.error('socket server error: ', error);
    }
};
