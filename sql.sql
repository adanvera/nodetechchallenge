
-- create a new schema

CREATE SCHEMA store;

-- create tables in new schema store

-- CREATE TABLE MANUFACTURERS
CREATE TABLE store.manufacturers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- CREATE TABLE CATEGORIES
CREATE TABLE store.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE store.materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    customer_part_id TEXT,
    manufacturer_id INT REFERENCES store.manufacturers(id) ON DELETE SET NULL,
    manufacturer_part_id TEXT,
    category_id INT REFERENCES store.categories(id) ON DELETE SET NULL,
    unit_of_measure VARCHAR(50),
    unit_quantity NUMERIC,
    requested_quantity NUMERIC,
    requested_unit_price DECIMAL(10,2),
    competitor_name VARCHAR(255),  
    competitor_part_name VARCHAR(255),
    competitor_part_id VARCHAR(100),
    CONSTRAINT unique_material UNIQUE (name, manufacturer_part_id)  -- Ensure that there are no duplicates in the combination of name and manufacturer_part_id.
);
