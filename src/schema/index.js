const { default: gql } = require("graphql-tag");
const { graphqlTypeDefs } = require("../common");

module.exports = gql`
    type Query
    ${graphqlTypeDefs(__dirname, 'query')}
`;