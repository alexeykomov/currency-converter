import express from 'express';
import {checkIfAuthenticated} from "../middlewares/auth.js";
import bodyParser from 'body-parser';
import {
  getCurrencies,
  getHistoricalExchangeRate,
  getLatestExchangeRates
} from "../services/currency.js";

export const currencyRouter = express.Router();
const jsonParser = bodyParser.json()

currencyRouter.get('/historical', checkIfAuthenticated, async (req, res, next) => {
  try {
    const {baseCurrency, targetCurrency, months} = req.query;
    const validMonths = ['1', '3', '6', '12'];

    if (!validMonths.includes(months)) {
      return res.status(400).send('Invalid query parameters');
    }

    res.json(await getHistoricalExchangeRate(baseCurrency, targetCurrency, months));
  } catch (e) {
    return res.status(500).send('Server error: ' + e.message);
  }
});

currencyRouter.get('/latest', checkIfAuthenticated, async (req, res, next) => {
  try {
    const {baseCurrency, targetCurrencies} = req.query;

    res.json(await getLatestExchangeRates(baseCurrency, targetCurrencies, 5));
  } catch (e) {
    res.status(500).send('Server error: ' + e.message);
  }
});

currencyRouter.get('/symbols', checkIfAuthenticated, async (req, res, next) => {
  try {
    res.json(await getCurrencies());
  } catch (e) {
    res.status(500).send('Server error: ' + e.message);
  }
});

currencyRouter.get('/pair', checkIfAuthenticated, async (req, res, next) => {
  try {
    const {baseCurrency, targetCurrency} = req.query;
    res.json(await getLatestExchangeRates(baseCurrency, targetCurrency, 1));
  } catch (e) {
    res.status(500).send('Server error: ' + e.message);
  }
});
