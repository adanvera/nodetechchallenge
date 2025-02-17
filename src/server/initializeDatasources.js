const datasource = require('../datasource');

module.exports = ({ prismaClient }, log) => {
    const dataSources = {
        material: new datasource.MaterialDatasource(prismaClient, log),
        manufacturer: new datasource.ManufacturerDatasource(prismaClient, log),
        category: new datasource.CategoryDatasource(prismaClient, log),
    };

    return dataSources;
};