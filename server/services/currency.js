import fetch from 'node-fetch';
import {
  getLatestHistoricalExchangeRateDate,
  insertHistoricalExchangeRates,
  getHistoricalExchangeRatesFromDb,
  getLatestTodayExchangeRateDate,
  insertLatestExchangeRates,
  getLatestExchangeRatesFromDb,
  selectCurrencies, insertCurrencies
} from "../db/currency.js";
import {
  getDate12MonthAgo,
  getYesterday,
  isPastInterval,
  isYesterday
} from "../util/date.js";

const API_URL = 'https://api.freecurrencyapi.com/v1';

export const getDateFrom = async (baseCurrency, targetCurrency) => {
  const lastDateFromDb = await getLatestHistoricalExchangeRateDate(baseCurrency, targetCurrency);
  if (!lastDateFromDb) {
    return getDate12MonthAgo();
  }
  const yesterday = getYesterday();
  if (lastDateFromDb.getTime() < yesterday.getTime()) {
    return lastDateFromDb
  }
  return yesterday;
}

export const getHistoricalExchangeRate = async (baseCurrency, targetCurrency, months) => {
  const lastDateFromDb = await getLatestHistoricalExchangeRateDate(baseCurrency, targetCurrency);
  if (lastDateFromDb && isYesterday(lastDateFromDb)) {
    const historicalRateAdapted = await getHistoricalExchangeRatesFromDb(baseCurrency, targetCurrency, months);
    return historicalRateAdapted;
  }

  const dateFrom = await getDateFrom(baseCurrency, targetCurrency);
  const apiDate = dateFrom.toISOString().slice(0, 10);
  const url = `${API_URL}/historical?date_from=${apiDate}&base_currency=${baseCurrency}&currencies=${targetCurrency}`;
  const response = await fetch(url, {
    headers: {
      apikey: process.env.API_KEY
    }
  });
  const data = await response.json();
  const historicalRates = data.data;

  await insertHistoricalExchangeRates(baseCurrency, historicalRates);

  const historicalRateAdapted = await getHistoricalExchangeRatesFromDb(baseCurrency, targetCurrency, months);
  return historicalRateAdapted;
}

export async function getLatestExchangeRates(baseCurrency, targetCurrencies, limit) {
  const lastDateFromDb = await getLatestTodayExchangeRateDate(baseCurrency, targetCurrencies);
  const withinInterval = !isPastInterval(lastDateFromDb, 10);
  if (lastDateFromDb && withinInterval) {
    const latestRateAdapted = await getLatestExchangeRatesFromDb(baseCurrency, targetCurrencies, limit);
    return latestRateAdapted;
  }

  const url = `${API_URL}/latest?base_currency=${baseCurrency}&currencies=${targetCurrencies}`;
  const response = await fetch(url, {
    headers: {
      apikey: process.env.API_KEY
    }
  });
  const data = await response.json();
  const latestRates = data.data;

  const res = await insertLatestExchangeRates(baseCurrency, targetCurrencies, latestRates);

  const latestRateAdapted = await getLatestExchangeRatesFromDb(baseCurrency, targetCurrencies, limit);
  return latestRateAdapted;
}

export const getCurrencies = async () => {
  let rows = await selectCurrencies();
  if (rows.length) {
    return rows;
  }
  const url = `${API_URL}/currencies`;
  const response = await fetch(url, {
    headers: {
      apikey: process.env.API_KEY
    }
  });
  const data = await response.json();
  const currencies = data.data;

  await insertCurrencies(currencies)
  rows = await selectCurrencies();

  return rows;
}
