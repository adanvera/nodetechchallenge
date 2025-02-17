const { join } = require('path');
const { readFileSync } = require('fs');

function graphqlTypeDefs(dirname, name) {
    return readFileSync(join(dirname, `${name}.graphql`)).toString('utf8');
}

function readCsvFile(dirname, name) {
    return readFileSync(join(dirname, `${name}.csv`)).toString('utf8');
}

function stripAnsi(str) {
    let cleanedMessage = str.replace(/\u001b\[[0-9;]*m/g, '');
    cleanedMessage = cleanedMessage.replace(/^Error:\s*/, '');
    return cleanedMessage;
}

module.exports = {
    graphqlTypeDefs,
    readCsvFile,
    stripAnsi
};