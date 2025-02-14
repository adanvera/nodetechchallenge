const RootDatasource = require('./RootDatasource');


class MaterialDatasource extends RootDatasource {
    constructor(pgClient, log) {
        super(pgClient, log);
    }
}

module.exports = MaterialDatasource;
