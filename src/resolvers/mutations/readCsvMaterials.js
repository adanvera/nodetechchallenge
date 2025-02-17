const errors = require('../../errors');

module.exports = async (parent, args, context, info) => {
    try {
        context.log.info('Starting MaterialDatasource.readCsvMaterials resolver');
        const readCsvMaterials = await context.datasources.material.readCsvMaterials(context);
        return readCsvMaterials;
    } catch (error) {
        context.log.error(error);
        if (error instanceof errors.Error) {
            context.log.error(error.toString());
            throw error;
        } else {
            context.log.error(error);
            throw new errors.ResolverError(
                {},
                {},
                'Error in MaterialDatasource.readCsvMaterials resolver',
            );
        }
    } finally {
        context.log.info('Finishing MaterialDatasource.readCsvMaterials resolver');
    }
};