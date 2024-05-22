import 'dotenv/config'; // load env variables
import app from './app';
import { createServer } from 'http';
import socket from './socket/index.socket';
import logger from './services/logger.service';

try {
    // TODO: authenticate db
    // set app port
    const port = Number(process.env.PORT) || 7001;

    const httpServer = createServer(app);
    socket(httpServer);

    // spin off the server
    httpServer.listen(port, () => {
        console.log(
            `🚀  Metaverse Magna Blockchain is ready at: http://localhost:${port}`
        );
        logger.info(
            `🚀  Metaverse Magna Blockchain is ready at: http://localhost:${port}`
        );
    });
} catch (err) {
    logger.error(err);
    process.exit();
}

process.on('SIGINT', async () => {
    // TODO: close connection to db
    process.exit(0);
});

process.on('unhandledRejection', async (error) => {
    // TODO: close connection to db
    logger.fatal(error);
    process.exit(1); //server needs to crash and a process manager will restart it
});

process.on('uncaughtException', async (error) => {
    // TODO: close connection to db
    logger.fatal(error);
    process.exit(1); //server needs to crash and a process manager will restart it
});
