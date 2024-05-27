import { AppDataSource } from "./config/database.config"
import 'dotenv/config'; // load env variables
import app from './app';
import { createServer } from 'http';
import socket from './socket/index.socket';

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
    });
} catch (err) {

    process.exit();
}

process.on('SIGINT', async () => {
    AppDataSource.destroy();
    process.exit(0);
});

process.on('unhandledRejection', async (error) => {
    AppDataSource.destroy();
    process.exit(1); //server needs to crash and a process manager will restart it
});

process.on('uncaughtException', async (error) => {
    AppDataSource.destroy();
    process.exit(1); //server needs to crash and a process manager will restart it
});

