const { PrismaClient } = require("@prisma/client");

async function createPrsimaClient(log) {
    log.info('Creating Prisma Client database connection, environment: ' + process.env.NODE_ENV);
    const prisma = new PrismaClient({
        log: [
            { emit: 'event', level: 'query' },
            { emit: 'event', level: 'error' },
            { emit: 'event', level: 'info' },
            { emit: 'event', level: 'warn' },
        ],
    });
    try {
        log.info('Connecting to postgres database');
        await prisma.$connect();
        log.info('Connected to postgres database');
    } catch (error) {
        log.error(`Error connecting to postgres database: ${error}`);
    }
    return prisma;
}

module.exports = async log => {
    try {
        const [prismaClient] = await Promise.all([
            createPrsimaClient(log),
        ]);
        return {
            prismaClient,
        };
    } catch (error) {
        log.error(error);
    }
}