const Error = require("../errors/Error");

class DataSourceError extends Error {
    constructor(
        detail = {},
        extensions = {},
        message = 'Error in DataSource',
        code = 'DATASOURCE_ERROR'
    ) {
        super({
            detail,
            extensions,
            message,
            code
        });
    }
}

module.exports = DataSourceError;