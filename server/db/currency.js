import {pool} from "./client.js";
import {getUTCDate} from "../util/date.js";

export const getLatestHistoricalExchangeRateDate = async (sourceCurrency, targetCurrency) => {
  const query = {
    text: 'SELECT date FROM historical_exchange_rates WHERE currency_name = $1 AND target_currency = $2 ORDER BY date DESC LIMIT 1',
    values: [sourceCurrency, targetCurrency],
  };

  try {
    const result = await pool.query(query);
    return result.rows[0] && result.rows[0].date;
  } catch (err) {
    console.error(err);
  }
}

export const getLatestTodayExchangeRateDate = async (sourceCurrency, targetCurrencies) => {
  const query = {
    text: 'SELECT date FROM latest_exchange_rates WHERE currency_name = $1 AND target_currencies = $2 ORDER BY date DESC LIMIT 1',
    values: [sourceCurrency, targetCurrencies],
  };

  try {
    const result = await pool.query(query);
    return result.rows[0] && result.rows[0].date;
  } catch (err) {
    console.error(err);
  }
}

export async function insertHistoricalExchangeRates(baseCurrency, exchangeRates) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const [date, rates] of Object.entries(exchangeRates)) {
      const values = Object.entries(rates).map(([currency, rate]) => {
        return [new Date(date), baseCurrency, currency, rate]
      });
      await client.query('INSERT INTO historical_exchange_rates (date, currency_name, target_currency, value) VALUES ($1, $2, $3, $4)',
          ...values
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    console.error('err: ', err);
    if (client) {
      await client.query('ROLLBACK');
    }
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function insertLatestExchangeRates(baseCurrency, targetCurrencies, exchangeRates) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const utcDate = getUTCDate();
    for (const [currency, rate] of Object.entries(exchangeRates)) {
      const values = [utcDate, targetCurrencies, baseCurrency, currency, rate];
      await client.query(
          'INSERT INTO latest_exchange_rates (date, target_currencies, currency_name, target_currency, value) VALUES ($1, $2, $3, $4, $5)',
          values,
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function getHistoricalExchangeRatesFromDb(currency, targetCurrency, months) {
  const today = getUTCDate();
  const startDate = new Date(today.getFullYear(), today.getMonth() - months + 1, 1);
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Construct the SQL query to retrieve the exchange rates
  const query = `
      SELECT date, value
      FROM historical_exchange_rates
      WHERE currency_name = $1
        AND target_currency = $2
        AND date >= $3
        AND date <= $4
      ORDER BY date ASC
  `;

  const {rows} = await pool.query(query, [currency, targetCurrency, startDate, endDate]);

  const results = rows.map(({date, value}) => [getUTCDate(date).toISOString().slice(0, 10), value]);
  return results;
}

export async function getLatestExchangeRatesFromDb(sourceCurrency, targetCurrencies, limit) {
  const query = `
      SELECT target_currency, value, date
      FROM latest_exchange_rates
      WHERE currency_name = $1
        AND target_currencies = $2
      ORDER BY date DESC 
      LIMIT ${limit}
  `;

  const {rows} = await pool.query(query, [sourceCurrency, targetCurrencies]);

  const results = rows.reduce((acc, {
    target_currency,
    value,
    date,
  }) => {
    acc.rates.push([target_currency, value]);
    if (!acc.lastUpdated) {
      acc.lastUpdated = date;
    }
    return acc
  }, {lastUpdated: null, rates: []});

  return results;
}

export const insertCurrencies = async (currencies) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const currency of Object.values(currencies)) {
      const text = 'INSERT INTO currencies(symbol, name, symbol_native, decimal_digits, rounding, code, name_plural) VALUES($1, $2, $3, $4, $5, $6, $7)';
      const values = [currency.symbol, currency.name, currency.symbol_native, currency.decimal_digits, currency.rounding, currency.code, currency.name_plural];
      await client.query(text, values);
      await client.query('COMMIT');
    }
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export const selectCurrencies = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT code, name FROM currencies');
    return result.rows;
  } finally {
    client.release();
  }
}

