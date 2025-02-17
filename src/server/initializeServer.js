const { ApolloServer } = require("@apollo/server")
const { ApolloServerPluginLandingPageDisabled } = require("@apollo/server/plugin/disabled");
const resolvers = require('../resolvers');
const typeDefs = require('../schema');
const { startStandaloneServer } = require("@apollo/server/standalone");
const { database } = require("../database");
const initializeDatasources = require('./initializeDatasources');
const { stripAnsi } = require("../common");

function createServer() {
    // IMPORTING NODE_ENV from .env file
    const environment = process.env.NODE_ENV || 'development'

    // SETTING UP THE SERVER WITH APOLLO SERVER
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: ['production'].includes(environment) ? [ApolloServerPluginLandingPageDisabled()] : [],
        formatError: (error) => {
            if (error.message) {
                error.message = stripAnsi(error.message);
            }
            return error;
        },
    })

    return server
}
class Server {
    constructor(log, port) {
        this.logger = log;
        this.server = createServer();
        this.port = port || 5000;
    }

    async start() {
        this.logger.info('Coneccting to the server...');
        const clients = await database(this.logger);
        const { url } = await startStandaloneServer(this.server, {
            context: async ({ req, res }) => {
                return {
                    req,
                    log: this.logger,
                    datasources: initializeDatasources(clients, this.logger),
                };
            },
            listen: { port: this.port },
        });

        this.url = url;
        this.logger.info(`🚀 Server ready at: ${url}`);
    }
}

module.exports = Server;