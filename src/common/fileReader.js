const { join } = require('path');
const { readFileSync } = require('fs');

function graphqlTypeDefs(dirname, name) {
    return readFileSync(join(dirname, `${name}.graphql`)).toString('utf8');
}

module.exports = {
    graphqlTypeDefs,
};