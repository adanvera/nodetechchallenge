const { gql } = require('graphql-tag');
const {
    ByteTypeDefinition,
    CurrencyDefinition,
    DateTypeDefinition,
    DateTimeTypeDefinition,
    EmailAddressTypeDefinition,
    JSONDefinition,
    JWTDefinition,
    LatitudeDefinition,
    LongitudeDefinition,
    PhoneNumberTypeDefinition,
    TimeTypeDefinition,
    URLTypeDefinition,
    UUIDDefinition,
} = require('graphql-scalars');

module.exports = gql`
    ${ByteTypeDefinition}
    ${CurrencyDefinition}
    ${DateTypeDefinition}
    ${DateTimeTypeDefinition}
    ${EmailAddressTypeDefinition}
    ${JSONDefinition}
    ${JWTDefinition}
    ${LatitudeDefinition}
    ${LongitudeDefinition}
    ${PhoneNumberTypeDefinition}
    ${TimeTypeDefinition}
    ${URLTypeDefinition}
    ${UUIDDefinition}
`;
