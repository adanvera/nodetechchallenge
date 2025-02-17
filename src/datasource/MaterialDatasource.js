const { parse } = require('csv-parse/sync');
const { readCsvFile } = require('../common');
const RootDatasource = require('./RootDatasource');
const errors = require('../errors');

class MaterialDatasource extends RootDatasource {
    constructor(pgClient, log) {
        super(pgClient, log);
    }

    async materials(pagination, filtro) {
        try {
            this.log.info("Starting function materials()");

            const skipPage = ((step, take) => {
                let offset;
                if (step === 1) offset = step - 1;
                if (step != 1) offset = (step - 1) * take;
                return offset;
            })(pagination.step, pagination.take);

            const takePage = pagination.take;

            let whereConditions = {};

            const { manufacturerName } = filtro;

            if (manufacturerName) {
                whereConditions.manufacturers = {
                    name: {
                        contains: manufacturerName,
                        mode: 'insensitive'
                    }
                }
            }

            const materials = await this.pgClient.materials.findMany({
                where: whereConditions,
                skip: skipPage,
                take: takePage,
                orderBy: {
                    id: pagination.order.toLowerCase(),
                },
                include: {
                    manufacturers: true,
                    categories: true
                }
            });

            return materials;
        } catch (error) {
            this.log.error('Error in function materials()', error);
            throw error;
        } finally {
            this.log.info('Finishing function materials()');
        }
    }

    async createMaterialsFromCsv(materials, datasources) {
        try {
            this.log.info('Starting function createMaterial()');

            // GET UNIQUE MANUFACTURER 
            const uniqueManufacturers = [
                ...new Set([
                    ...materials.map(item => item.manufacturer_name).filter(Boolean),
                    ...materials.map(item => item.competitor_name).filter(Boolean)
                ])
            ];
            // GET CATEGORY
            const uniqueCategories = [...new Set(materials.map(item => item.category).filter(Boolean))];

            //VALIDATE MANUFACTURERS IN BULK
            const validatedManufacturers = await datasources.manufacturer.validateManufacturers(uniqueManufacturers);
            //VALIDATE CATEGORIES IN BULK
            const validatedCategories = await datasources.category.validateCategories(uniqueCategories);

            const formattedMaterials = materials.map(item => {
                const manufacturer = validatedManufacturers.find(material => material.name === item.manufacturer_name);
                const category = validatedCategories.find(categ => categ.name === item.category);
                return {
                    name: item.name,
                    description: item.description || "",
                    long_description: item.long_description || "",
                    customer_part_id: item.customer_part_id || "",
                    manufacturer_id: manufacturer ? manufacturer.id : null,
                    manufacturer_part_id: item.manufacturer_part_id || "",
                    category_id: category ? category.id : null,
                    unit_of_measure: item.unit_of_measure || "",
                    unit_quantity: Number(item.unit_quantity) || 0,
                    requested_quantity: Number(item.requested_quantity) || 0,
                    requested_unit_price: Number(item.requested_unit_price) || 0,
                    competitor_name: item.competitor_name || "",
                    competitor_part_name: item.competitor_part_name || "",
                    competitor_part_id: item.competitor_part_id || ""
                };
            });

            const result = await this.pgClient.materials.createMany({
                data: formattedMaterials,
                skipDuplicates: true
            });

            const initialCount = formattedMaterials.length;
            const insertedCount = result.count;
            const duplicateCount = initialCount - insertedCount;

            if (insertedCount > 0) {
                this.log.debug(`TOTAL NEW MATERIALS ADED: ${insertedCount}`);
            }

            if (duplicateCount > 0) {
                this.log.warn(`DUPLICATED SKIPPED MATERIALS: ${duplicateCount}`);
            }

            return result
        } catch (error) {
            this.log.error('Error in function createMaterial()', error);
            throw error;
        } finally {
            this.log.info('Finishing function createMaterial ()');
        }
    }

    async readCsvMaterials({ datasources }) {
        try {
            this.log.info('Starting function readCsvMaterials()');

            // READ CSV FILE
            const fileName = 'materials';
            const file = readCsvFile(__dirname + '/../data', fileName);

            // PARSING CSV FILE
            const fileData = parse(file, {
                columns: true,
                skip_empty_lines: true
            });

            // CLEAN DATA IF KEY IS EMPTY
            const cleanedData = fileData.map(item => {
                const cleanedItem = {};
                for (let key in item) {
                    if (key !== "") {  // IF KEY IS NOT EMPTY
                        cleanedItem[key] = item[key];
                    }
                }
                return cleanedItem;
            });

            this.log.debug('THERE ARE: ' + cleanedData.length + ' ITEMS IN THE FILE');

            // MAKE SURE THAT THE NAME IS NOT EMPTY
            const validData = cleanedData.filter(item => {
                item.name = item.name || item.description || item.long_description;
                delete item.id;
                return item.name;
            });

            const expectedHeaders = [
                "name",
                "description",
                "long_description",
                "customer_part_id",
                "manufacturer_name",
                "manufacturer_part_id",
                "competitor_name",
                "competitor_part_name",
                "competitor_part_id",
                "category",
                "unit_of_measure",
                "unit_quantity",
                "requested_quantity",
                "requested_unit_price"
            ];

            // extract headers of the valid data
            const headers = Object.keys(validData[0]);

            // checking if the headers are valid
            if (headers && headers.length > 0) {
                headers.forEach(header => {
                    if (!expectedHeaders.includes(header)) {
                        throw new Error(`Invalid header found: '${header}'. Please ensure the headers in the CSV file are correct and try again.`);
                    } else {
                        this.log.debug('Valid header: ' + header)
                    }
                });
                this.log.debug('All headers are valid');
            } else {
                this.log.error('No headers found in the file');
                throw new Error('No headers found in the file. Please add headers to the CSV file and try again.');
            }

            this.log.debug('THERE ARE: ' + validData.length + ' VALID ITEMS IN THE FILE');

            // FUNCTION TO CREATE DATA IN BATCHES

            const createDataWithBatches = async (data, batchSize) => {
                const batches = [];

                for (let i = 0; i < data.length; i += batchSize) {
                    const batch = data.slice(i, i + batchSize); // CREATING BATCHES
                    batches.push(batch);
                    try {
                        await this.createMaterialsFromCsv(batch, datasources);
                        this.log.info(`Batch ${i / batchSize + 1} processed successfully`);
                    } catch (error) {
                        this.log.error(`Error processing batch ${i / batchSize + 1}:`, error);
                    }
                }

                return batches;
            };

            const batchSize = 5000;  // BATCH SIZE
            const batches = await createDataWithBatches(validData, batchSize);

            this.log.debug('Processed: ' + batches.length + ' batches');
            this.log.info('Data processing completed successfully');

            return 'Material list loaded successfully';

        } catch (error) {
            this.log.error('Error in function readCsvMaterials()', error);
            throw new errors.DataSourceError(
                {},
                {},
                error,
                'DataSourceError',
            );
        } finally {
            this.log.info('Finishing function readCsvMaterials()');
        }
    }

}

module.exports = MaterialDatasource;