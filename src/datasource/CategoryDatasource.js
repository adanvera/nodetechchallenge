const RootDatasource = require("./RootDatasource");
const errors = require('../errors');

class CategoryDatasource extends RootDatasource {
    constructor(pgClient, log) {
        super(pgClient, log);
    }

    async validateCategories(names) {
        try {
            this.log.info('Validating categories in bulk');

            // EXISTING CATEGORIES
            const existingCategories = await this.pgClient.categories.findMany({
                where: { name: { in: names } }
            });

            // CREATE A MAP OF EXISTING CATEGORIES
            const existingMap = new Map(existingCategories.map(c => [c.name, c]));

            // FILTER NAMES THAT DO NOT EXIST AND CREATE NEW ONES
            const newNames = names.filter(name => !existingMap.has(name));
            if (newNames.length > 0) {
                await this.pgClient.categories.createMany({
                    data: newNames.map(name => ({ name })),
                    skipDuplicates: true
                });

                // GET THE NEW CATEGORIES CREATED
                const newCategories = await this.pgClient.categories.findMany({
                    where: { name: { in: newNames } }
                });

                newCategories.forEach(c => existingMap.set(c.name, c));
            }

            return names.map(name => existingMap.get(name));

        } catch (error) {
            this.log.error('Error in validateCategories()', error);
            throw error;
        } finally {
            this.log.info('Finishing function validateCategories()');
        }
    }


    async categoryStats(pagination) {
        try {
            this.log.info('Starting function categoryStats()');

            const skipPage = ((step, take) => {
                let offset;
                if (step === 1) offset = step - 1;
                if (step != 1) offset = (step - 1) * take;
                return offset;
            })(pagination.step, pagination.take);

            const takePage = pagination.take;

            // GETTING CATEGORIES WITH PAGINATION
            const categories = await this.pgClient.categories.findMany({
                skip: skipPage,
                take: takePage,
                orderBy: {
                    id: pagination.order.toLowerCase(),
                },
            });

            // EXTRACT THE IDS OF THE CATEGORIES
            const categoryIds = categories.map(category => category.id);

            // GETTING AGGREGATES FOR MATERIALS IN EACH CATEGORY 
            const materialsAggregates = await this.pgClient.materials.groupBy({
                by: ['category_id'],
                _count: {
                    id: true,
                },
                _avg: {
                    requested_unit_price: true,
                },
                _min: {
                    requested_unit_price: true,
                },
                _max: {
                    requested_unit_price: true,
                },
                where: {
                    category_id: {
                        in: categoryIds,
                    },
                },
            });

            // FORMAT THE DATA AND ADD IT TO THE CATEGORIES
            categories.forEach(category => {
                const categoryAggregates = materialsAggregates.find(
                    aggregate => aggregate.category_id === category.id
                );

                if (categoryAggregates) {
                    category.materialsCount = categoryAggregates._count.id;
                    category.avgPrice = categoryAggregates._avg.requested_unit_price;
                    category.minPrice = categoryAggregates._min.requested_unit_price;
                    category.maxPrice = categoryAggregates._max.requested_unit_price;
                }
            });

            return categories;

        } catch (error) {
            this.log.error('Error in function categoryStats()', error);
            throw new errors.DataSourceError(
                {},
                {},
                error,
                'DataSourceError',
            );
        } finally {
            this.log.info('Finishing function categoryStats()');
        }
    }


}

module.exports = CategoryDatasource;