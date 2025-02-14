class RootDatasource {
    constructor(pgCliente, log) {
        this.pgCliente = pgCliente;
        this.log = log;
    }
}

module.exports = RootDatasource;