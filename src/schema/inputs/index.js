const { default: gql } = require('graphql-tag');
const { graphqlTypeDefs } = require("../../common");

module.exports = gql`
    ${graphqlTypeDefs(__dirname, 'PaginationInput')}
    ${graphqlTypeDefs(__dirname, 'FilterInput')}
`;