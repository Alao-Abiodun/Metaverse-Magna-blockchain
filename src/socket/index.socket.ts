import { Server } from 'socket.io';
import web3 from 'web3';

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

                socket.on('disconnect', () => {
                    console.log('User disconnected ' + socket.id);
                });

                socket.on('message', (msg) => {
                    console.log(`Received message from ${socket.id}: ${msg}`);
                    io.emit('message', msg);
                });
            
                socket.on('disconnect', () => {
                    console.log('User disconnected ' + socket.id);
                });
            } catch (error) {
                console.error('socket connection error', error)
            }
        });
    } catch (error) {
        console.error('socket server error: ', error);
    }
};
