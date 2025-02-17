const RootDatasource = require("./RootDatasource");

class ManufacturerDatasource extends RootDatasource {
    constructor(pgClient, log) {
        super(pgClient, log
        );
    }

    async validateManufacturers(names) {
        try {

            this.log.info('Starting function validateManufacturer()');

            // EXISTING MANUFACTURERS
            const existingManufacturers = await this.pgClient.manufacturers.findMany({
                where: { name: { in: names } }
            });

            // CREATE A MAP WITH THE EXISTING MANUFACTURERS
            const existingMap = new Map(existingManufacturers.map(m => [m.name, m]));

            // FILTER THE NAMES THAT DO NOT EXIST AND CREATE NEW ONES
            const newNames = names.filter(name => !existingMap.has(name));
            if (newNames.length > 0) {
                await this.pgClient.manufacturers.createMany({
                    data: newNames.map(name => ({ name })),
                    skipDuplicates: true
                });

                // GET THE NEW MANUFACTURERS
                const newManufacturers = await this.pgClient.manufacturers.findMany({
                    where: { name: { in: newNames } }
                });

                newManufacturers.forEach(m => existingMap.set(m.name, m));
            }

            // RETURN THE MANUFACTURERS
            return names.map(name => existingMap.get(name));

        } catch (error) {
            this.log.error('Error in function validateManufacturers()', error);
            throw error;
        } finally {
            this.log.info('Finishing function validateManufacturers()');
        }

    }

}

module.exports = ManufacturerDatasource;