const dotenv = require('dotenv');
dotenv.config('.././.env');
const { log } = require('./common');
const { Server } = require('./server');

async function initialize() {
    log.info('Initializing server...');
    try {
        const server = new Server(log, Number(process.env.PORT));
        await server.start();
    } catch (error) {
        log.error('There was an error initializing the server: ', error);
    }
}

initialize();
