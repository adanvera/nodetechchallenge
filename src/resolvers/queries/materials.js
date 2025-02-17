const errors = require('../../errors');
module.exports = async (parent, args, context, info) => {
    try {
        context.log.info('Starting materials list resolver...');
        const pagination = args.pagination;
        const input = args.input;
        const materials = await context.datasources.material.materials(pagination, input);
        return materials;
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
        context.log.info('Finishing materials list resolver...');
    }
};