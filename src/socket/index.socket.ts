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
            try {
                console.log('A user connected ' + socket.id);

                socket.on('subscribe', (data) => {
                    const { type, address } = data;
                    if (type === 'all') {
                        socket.join('all');
                    } else if (type === 'sender') {
                        socket.join(address);
                    } else if (type === 'receiver') {
                        socket.join(address);
                    } else if (type.startsWith('range:')) {
                        socket.join(type);
                    }
                });

                socket.on('disconnect', () => {
                    console.log('User disconnected ' + socket.id);
                });
            } catch (error) {
                console.error('socket connection error', error);
            }
        });

        io.use(jwtMiddleware);

        trackAndStreamTransactions(io);
    } catch (error) {
        console.error('socket server error: ', error);
    }
};
