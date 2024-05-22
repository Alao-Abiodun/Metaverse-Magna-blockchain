import { Server } from 'socket.io';
// import { findById } from '../repositories/appointment.repository';
// import { create } from '../repositories/chat.repository';

export default (app: Express.Application) => {
    try {
        const io = new Server(app, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
            path: '/provider-socket',
        });

        io.on('connection', (socket) => {
            try {
                console.log('A user connected ' + socket.id);

                socket.on('disconnect', () => {
                    console.log('User disconnected ' + socket.id);
                });
            } catch (error) {
                console.error('socket connection error', error)
            }
        });

        const chatNamespace = io.of('/chat');

        chatNamespace.use(async (socket, next) => {
            try {
                console.log('Connect User to chat namespace middleware:' + socket.id);
                const {
                    query: { sender, recipient },
                    auth: { token },
                } = socket.handshake;

                // const appointment = await findById(String(token));

                // if (!appointment || appointment.status !== 'pending') {
                //     console.error('Appointment is not pending or invalid');
                //     return next(new Error('Appointment is not pending'));
                // }

                // socket.data = { sender, recipient, appointmentId: token };
                next();
            } catch (error) {
                console.log('Connect User -' + socket.id);
                console.error('chat middleware error', error);
            }
        });

        chatNamespace.on('connection', (socket) => {
            try {
                console.log('A user connected to chat namespace ' + socket.id);

                socket.on('disconnect', () => {
                    console.log(
                        'User disconnected from chat namespace ' + socket.id
                    );
                });

                const { appointmentId, sender, recipient } = socket.data;

                const chatRoomSuffix = sender === 'patient' ? recipient : sender;
                const chatRoomName = `${appointmentId}_${chatRoomSuffix}`;

                // console.log('Chat room suffix: ', chatRoomSuffix);
                // console.log('Chat room name: ', chatRoomName);

                socket.join(chatRoomName);

                // socket.on('chatMessage', async (data) => {
                //     const { message, messageType } = data;
                //     const { createdAt } = await create({
                //         appointmentId,
                //         sender,
                //         recipient,
                //         message,
                //         messageType,
                //     });
                //     chatNamespace
                //         .to(chatRoomName)
                //         .emit('chatMessage', { message, messageType, sender, createdAt });
                    
                // });
            } catch (error) {
                console.error('chat namespace error', error);
            }
        });

        const agoraNameHandlerNsp = io.of('/agoraName');

        agoraNameHandlerNsp.use(async (socket, next) => {
            try {
                const {
                    query: { name, uid },
                    auth: { token },
                } = socket.handshake;

                // const appointment = await findById(String(token));

                // if (!appointment || appointment.status !== 'pending') {
                //     return next(new Error('Appointment is not pending'));
                // }

                socket.data = { uid, name, appointmentId: token };
                next();
            } catch (error) {
                console.error('agora middleware error', error);
            }
        });

        agoraNameHandlerNsp.on('connection', async (socket) => {
            try {
                console.log(
                    'A user connected to agoraNameHandler namespace ' + socket.id
                );
    
                socket.on('disconnect', () => {
                    console.log(
                        'User disconnected from agoraNameHandler namespace ' +
                            socket.id
                    );
                });
    
                const { appointmentId, uid, name } = socket.data;
    
                const agoraNameHandlerRoomName = `${appointmentId}_agoraNameHandler`;
    
                socket.join(agoraNameHandlerRoomName);
    
                agoraNameHandlerNsp
                    .to(agoraNameHandlerRoomName)
                    .emit('newUser', { uid, name });
    
                const existingSocketUsers = await agoraNameHandlerNsp
                    .to(agoraNameHandlerRoomName)
                    .fetchSockets();
                const existingSocketUsersData = existingSocketUsers.map(
                    (socket) => socket.data
                );
                socket.emit('existingUsers', existingSocketUsersData);
            } catch (error) {
                console.error('agora namespace error: ', error);
            }
        });
    } catch (error) {
        console.error('socket server error: ', error);
    }
};
