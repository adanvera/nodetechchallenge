const Error = require('./Error');

class ResolverError extends Error {
    constructor(
        detail = {},
        extensions = {},
        message = 'Error in Resolver',
        code = 'RESOLVER_ERROR',
    ) {
        super({ detail, extensions, message, code });
    }
}

module.exports = ResolverError;
