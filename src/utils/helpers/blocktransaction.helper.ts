import { Server } from 'socket.io';
import Web3 from 'web3';
import { parallel } from 'async';
import 'dotenv/config'; // load env variables

const web3 = new Web3(String(process.env.RPC_URL)); // replace with your actual provider

const fetchBlockTransactions = async (blockNumber: number): Promise<any[]> => {
    const block = await web3.eth.getBlock(blockNumber, true);
    return block.transactions;
};

const sendPerTransactions = (io: Server, transactions: any[]) => {
    const chunkSize = 500;
    for (let i = 0; i < transactions.length; i += chunkSize) {
        const chunk = transactions.slice(i, i + chunkSize);
        io.emit('event: all', chunk);
    }
};

const emitBasedOnSubscriptions = (io: Server, tx: any) => {
    const valueInEth = parseFloat(web3.utils.fromWei(tx.value, 'ether'));
    const valueInUSD = valueInEth * 5000; 

    io.to(tx.from).emit('event: sender', tx);
    io.to(tx.to).emit('event: receiver', tx);

    // Emit to value range channels
    if (valueInUSD >= 0 && valueInUSD <= 100) {
        io.emit('event: range:a', tx);
    } else if (valueInUSD > 100 && valueInUSD <= 500) {
        io.emit('event: range:b', tx);
    } else if (valueInUSD > 500 && valueInUSD <= 2000) {
        io.emit('event: range:c', tx);
    } else if (valueInUSD > 2000 && valueInUSD <= 5000) {
        io.emit('event: range:d', tx);
    } else if (valueInUSD > 5000) {
        io.emit('event: range:e', tx);
    }
};

const processBlocks = async (latestBlockNumber: bigint, newBlockNumber: bigint, io: Server) => {
    const blockNumbers = [];
    for (let i = latestBlockNumber + BigInt(1); i <= newBlockNumber; i++) {
        blockNumbers.push(i);
    }

    parallel(
        blockNumbers.map(blockNumber => async () => {
            const transactions = await fetchBlockTransactions(Number(blockNumber));
            transactions.forEach(tx => {
                sendPerTransactions(io, [tx]);
                emitBasedOnSubscriptions(io, tx);
            });
        }),
        (err) => {
            if (err) {
                console.error('Error processing blocks:', err);
            }
        }
    );
};

export const trackAndStreamTransactions = async (io: Server) => {
    let latestBlockNumber: bigint = BigInt(await web3.eth.getBlockNumber());

    setInterval(async () => {
        const newBlockNumber: bigint = BigInt(await web3.eth.getBlockNumber());
        if (newBlockNumber > latestBlockNumber) {
            await processBlocks(latestBlockNumber, newBlockNumber, io);
            latestBlockNumber = newBlockNumber;
        }
    }, 12000); // Check every 12 seconds
};
