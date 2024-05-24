import { AppDataSource } from "./config/database.config"
import 'dotenv/config'; // load env variables
import app from './app';
import { createServer } from 'http';
import socket from './socket/index.socket';
import logger from './services/logger.service';

try {
    AppDataSource
    .initialize()
    .then(() => {
        console.log("Database is connected and initial")
    })
    .catch((err) => {
        console.error("Error connecting to the database", err)
    })

    // set app port
    const port = Number(process.env.PORT) || 7001;
    // spin off the server
    const httpServer = createServer(app);
    socket(httpServer);

    // spin off the server
    httpServer.listen(port, () => {
        console.log(
            `🚀  Metaverse Magna service is ready at: http://localhost:${port}`
        );
        logger.info(
            `🚀  Metaverse Magna service is ready at: http://localhost:${port}`
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

