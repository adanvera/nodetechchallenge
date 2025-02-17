const { GraphQLError } = require('graphql');

class Error extends GraphQLError {
    #detail; // Private field

    constructor({ message = '', code, extensions, detail }) {
        super(
            message,
            {
                extensions: {
                    code,
                    ...extensions,
                },
            });
        this.#detail = detail;
    }

    toString() {
        return JSON.stringify({
            message: this.message,
            extensions: this.extensions,
            detail: this.#detail,
        });
    }

    toJSON() {
        return {
            message: this.message,
            extensions: this.extensions,
            detail: this.#detail,
        };
    }
}

module.exports = Error;
