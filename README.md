# NodeTechChallenge

## How to Run

### Prerequisites

Before running the project, make sure you have the following tools installed:

- **Node.js** (v22.14.0)
- **npm** to manage dependencies
- Access to the necessary data sources for the project (Database credentials in `.env` file)
- **PostgreSQL** database (Ensure the database is created and set up as per the provided `sql.sql` schema file; the tables are already defined in the file).

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/adanvera/nodetechchallenge.git
   cd nodetechchallenge

2. **Install dependencies**

    ```bash 
    npm install

3. **Set up the necessary environment variables**:

    - Create a `.env` file in the root directory of the project.
    - Add the following environment variables:

    ```env
    NODE_ENV="development"
    PORT=8000
    DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database_name>?connection_limit=10&pool_timeout=20"
    LOGGING_LEVEL_CATEGORI="winston custom format"
    LOGGING_LEVEL="debug"
    LOGGING_FILE_PATH="/var/log/nodejs/"
    LOGGING_FILE_NAME="materials_verusen"
    LOGGING_FILE_MAXSIZE=3000000
    LOGGING_FILE_PATERN="MM-DD-YYYY HH:mm:ss"
    ```

    - Replace the placeholders `<username>`, `<password>`, `<host>`, `<port>`, `<database_name>` with your actual database connection details.

4. **Run the Prisma pull command**:

    Once you have completed the previous steps (installing dependencies, setting up the `.env` file, and creating the database), run the following command to pull the schema from your database:

    ```bash
    npm run prisma:pull
    ```

    This command will sync your Prisma schema with the database, ensuring that Prisma has access to the necessary database structure.

5. **Generate Prisma Client**:

    After pulling the schema with the `prisma:pull` command, generate the Prisma Client by running:

    ```bash
    npm run prisma:generate
    ```

    This command will generate the Prisma Client, which you can use to interact with your database in your application.

6. **Start the Application**:

    ```bash
    npm run start
    ```

    This command will start your application, allowing you to interact with your database using Prisma Client. Ensure that you have completed the previous steps, such as generating the Prisma Client, before running this command.

    Once the application is running, logs will be displayed based on the actions performed, helping you monitor the execution and debug if necessary.

7. **Use Queries and Mutations in Apollo Server**:

    Once the application is running, open Apollo Server’s playground or GraphQL endpoint in your browser. The server should be accessible at the specified server and port, for example: http://localhost:8000


8. **Use Queries and Mutations in Apollo Server**:

Here are a few example queries you can use in Apollo Server's playground to retrieve data from your database.


### Mutation: `readCsvMaterials` (Load CSV Data)

You can use the following mutation to load the material data from the CSV file into the database.

    ```graphql
    mutation Mutation {
    readCsvMaterials
    }
    ```

### a) Query: `Materials` (Retrieve All Data)

    ```graphql
    query Materials($input: FilterInput, $pagination: PaginationInput) {
        materials(input: $input, pagination: $pagination) {
            id
            name
            description
            longDescription
            customerPartId
            manufacturerPartId
            categoryId
            unitOfMeasure
            unitQuantity
            requestedQuantity
            requestedUnitPrice
            competitorName
            competitorPartName
            competitorPartId
            categories {
            name
            id
            }
            manufacturers {
            name
            id
            }
        }
    }
    ```

### With Variables:

    - take: Defines the number of records to return in each query.
    - step: Defines the step or increment for pagination.

```json
{
  "pagination": {
    "step": 1,
    "order": "ASC",
    "take": 20
  },
  "input": {
    "manufacturerName": ""
  }
}
```

### b) Query: `Materials` (List of Parts by Manufacturer Name (with Wildcard))

    ```graphql
    query Materials($input: FilterInput, $pagination: PaginationInput) {
        materials(input: $input, pagination: $pagination) {
            id
            name
            description
            longDescription
            customerPartId
            manufacturerPartId
            categoryId
            unitOfMeasure
            unitQuantity
            requestedQuantity
            requestedUnitPrice
            competitorName
            competitorPartName
            competitorPartId
            categories {
            name
            id
            }
            manufacturers {
            name
            id
            }
        }
    }
    ```

### With Variables:

    - take: Defines the number of records to return in each query.
    - step: Defines the step or increment for pagination.

```json
{
    "pagination": {
        "step": 1,
        "order": "ASC",
        "take": 20
    },
    "input": {
        "manufacturerName": "POWER"  # This will match any manufacturer name containing "POWER"
    }
}
```

### c) Query: Item Count & Avg, Min, Max Price for a Category

    ```graphql
    query Query($pagination: PaginationInput) {
    categoryStats(pagination: $pagination)
    }
    ```


### With Variables:

    - take: Defines the number of records to return in each query.
    - step: Defines the step or increment for pagination.

```json
{
  "pagination": {
    "take": 55,
    "step": 1,
    "order": "ASC"
  }
}
```