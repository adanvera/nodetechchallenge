
module.exports = async (parent, args, context, info) => {
    try {
        context.log.info('Starting materials list resolver...');
        return 'list of materials';
    } catch (error) {
        context.log.error('Error in materials list resolver: ', error);
        throw error;
    } finally {
        context.log.info('Finishing materials list resolver...');
    }
};