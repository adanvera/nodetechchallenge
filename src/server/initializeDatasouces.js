const datasource = require('../datasource');

module.exports = ({ prismaClient }, log) => {
    const dataSources = {
        materials: new datasource.MaterialDatasource(prismaClient, log),
    };

    return dataSources;
};
