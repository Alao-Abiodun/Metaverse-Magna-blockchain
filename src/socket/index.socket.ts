import { Server } from 'socket.io';
import web3 from 'web3';

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

                socket.on('subscribe', (filter) => {
                    socket.join(filter);
                });
            
                socket.on('unsubscribe', (filter) => {
                    socket.leave(filter);
                });
            
                socket.on('disconnect', () => {
                    console.log('User disconnected ' + socket.id);
                });
            } catch (error) {
                console.error('socket connection error', error)
            }
        });

        // Listen to new blocks and fetch transactions
        // web3.eth.subscribe('newBlockHeaders', async (error, blockHeader) => {
        // if (error) {
        //         console.error(error);
        //         return;
        // }
        // const block = await web3.eth.getBlock(blockHeader.number, true);

        // block.transactions.forEach((tx) => {
        //     const txData = {
        //         sender: tx.from,
        //         receiver: tx.to,
        //         blockNumber: tx.blockNumber,
        //         blockHash: tx.blockHash,
        //             transactionHash: tx.hash,
        //             gasPrice: tx.gasPrice,
        //             value: tx.value,
        //         };

        //         // Emit to all clients
        //         io.to('all').emit('newTransaction', txData);

        //         // Emit based on value ranges
        //         const valueInEth = web3.utils.fromWei(tx.value, 'ether');
        //         if (valueInEth >= 0 && valueInEth <= 100) {
        //             io.to('range_0_100').emit('newTransaction', txData);
        //         } else if (valueInEth > 100 && valueInEth <= 500) {
        //             io.to('range_100_500').emit('newTransaction', txData);
        //         } else if (valueInEth > 500 && valueInEth <= 2000) {
        //             io.to('range_500_2000').emit('newTransaction', txData);
        //         } else if (valueInEth > 2000 && valueInEth <= 5000) {
        //             io.to('range_2000_5000').emit('newTransaction', txData);
        //         } else if (valueInEth > 5000) {
        //             io.to('range_5000_plus').emit('newTransaction', txData);
        //         }

        //         // Emit based on sender and receiver addresses
        //         if (tx.from) {
        //             io.to(`sender_${tx.from}`).emit('newTransaction', txData);
        //         }
        //         if (tx.to) {
        //             io.to(`receiver_${tx.to}`).emit('newTransaction', txData);
        //         }
        //     });
        // });
    } catch (error) {
        console.error('socket server error: ', error);
    }
};
