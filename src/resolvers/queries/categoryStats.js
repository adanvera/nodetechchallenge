const errors = require('../../errors');
module.exports = async (parent, args, context, info) => {
    try {
        context.log.info('Starting categoryStats resolver...');
        const pagination = args.pagination;
        const stats = await context.datasources.category.categoryStats(pagination);
        return stats;
    } catch (error) {
        context.log.error('Error in categoryStats resolver: ', error);
        if (error instanceof errors.Error) {
            context.log.error(error.toString());
            throw error;
        } else {
            context.log.error(error);
            throw new errors.ResolverError(
                {},
                {},
                'Error in CategoryDatasource.categoryStats resolver',
            );
        }
    } finally {
        context.log.info('Finishing categoryStats resolver...');
    }
}