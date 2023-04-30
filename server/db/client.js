import pkg from 'pg';
const {Pool} = pkg;

import * as dotenv from 'dotenv';
dotenv.config()
export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

const createHistoricalRatesTableSql = `
    CREATE TABLE IF NOT EXISTS historical_exchange_rates
    (
        id              SERIAL PRIMARY KEY,
        date            DATE           NOT NULL,
        currency_name   VARCHAR(3)     NOT NULL,
        target_currency VARCHAR(3)     NOT NULL,
        value           NUMERIC(10, 4) NOT NULL
    );
`;

const createSymbolsTable = `
    CREATE TABLE IF NOT EXISTS currencies (
                                id SERIAL PRIMARY KEY,
                                symbol VARCHAR(10) NOT NULL,
                                name VARCHAR(100) NOT NULL,
                                symbol_native VARCHAR(10) NOT NULL,
                                decimal_digits INTEGER NOT NULL,
                                rounding INTEGER NOT NULL,
                                code VARCHAR(10) NOT NULL,
                                name_plural VARCHAR(100) NOT NULL
    );
`;

const createLatestRatesTableSql = `
    CREATE TABLE IF NOT EXISTS latest_exchange_rates
    (
        id              SERIAL PRIMARY KEY,
        date            TIMESTAMP           NOT NULL,
        target_currencies VARCHAR(19)     NOT NULL,
        currency_name   VARCHAR(3)     NOT NULL,
        target_currency VARCHAR(3)     NOT NULL,
        value           NUMERIC(10, 4) NOT NULL
    );
`;

// Use the query method of the pool to execute the SQL statement
export const setUp = async () => {
  try {
    await Promise.all([
      pool.query(createHistoricalRatesTableSql),
      pool.query(createLatestRatesTableSql),
      pool.query(createSymbolsTable),
    ]);
    console.log('Tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}


// connect to the database and create the initial tables if they don't exist yet
export const getClient = async () => {
  let client;
  try {
    client = await pool.connect();
    return client;
  } catch (err) {
    console.error('Error creating tables: ', err.stack);
  }
};
