class RootDatasource {
    constructor(pgClient, log) {
        this.pgClient = pgClient;
        this.log = log;
    }
}

module.exports = RootDatasource;