const { default: gql } = require("graphql-tag");
const { graphqlTypeDefs } = require("../common");
const scalars = require('./scalars');
const inputs = require('./inputs');
const enums = require('./enums');

module.exports = gql`
    ${enums}
    ${scalars}
    ${inputs}
    type Query
    ${graphqlTypeDefs(__dirname, 'query')}
    type Mutation
    ${graphqlTypeDefs(__dirname, 'mutation')}
`;