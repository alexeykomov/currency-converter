import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchConversionRate, fetchCurrencies} from "./converterAPI";


export const initialState = {
  currencies: null,
  symbolFrom: '',
  symbolTo: '',
  direction: 'from',
  amountFrom: 1000,
  amountTo: 0,
  rate: 1,
  loadingCurrencies: false,
  errorCurrencies: null,
  loadingConversion: false,
  errorConversion: null,
  lastUpdated: new Date(),
};

const ConverterErrors = {
  Generic: 'Generic error',
}

// Thunks.
export const setCurrenciesAsync = createAsyncThunk(
    'converter/setCurrencies',
    async (user, thunkAPI) => {

      const response = await fetchCurrencies(user);
      return response;

    }
);

export const setConversionRateAsync = createAsyncThunk(
    'converter/setConversionRate',
    async ({direction, amount, symbol, user}, thunkAPI) => {
      thunkAPI.dispatch(setSymbol({direction, symbol}));
      thunkAPI.dispatch(setAmount({direction, amount}));
      const state = thunkAPI.getState().converter;

      const symbolFrom = direction === 'from' ? state.symbolFrom : state.symbolTo;
      const symbolTo = direction === 'from' ? state.symbolTo : state.symbolFrom;
      if (!symbolFrom || !symbolTo) {
        thunkAPI.rejectWithValue('Not defined currencies.');
        return;
      }
      if (symbolFrom === symbolTo) {
        return {rate: 1, direction, lastUpdated: new Date};
      }

      const response = await fetchConversionRate(symbolFrom, symbolTo, user);
      if (!response) {
        thunkAPI.rejectWithValue('Generic error.')
        return;
      }
      return {
        rate: response.rate,
        direction,
        lastUpdated: response.lastUpdated
      };
    }
);

export const converterSlice = createSlice({
  name: 'converter',
  initialState: () => initialState,
  reducers: {
    setCurrencies: (state, action) => {
      state.currencies = action.payload;
    },
    setSymbol: (state, action) => {
      if (action.payload.direction === 'from') {
        state.symbolFrom = action.payload.symbol;
        return;
      }
      state.symbolTo = action.payload.symbol;
    },
    setAmount: (state, action) => {
      if (action.payload.direction === 'from') {
        state.amountFrom = action.payload.amount;
        return;
      }
      state.amountTo = action.payload.amount;
    }
  },
  extraReducers: {
    [setCurrenciesAsync.pending]: (state) => {
      state.loadingCurrencies = true;
      state.errorCurrencies = null;
    },
    [setCurrenciesAsync.fulfilled]: (state, action) => {
      state.loadingCurrencies = false;
      state.currencies = action.payload;
      state.errorCurrencies = null;
      const usd = 'USD';
      state.symbolFrom = usd;
      const symbolTo = state.currencies.find(c => c.code !== usd);
      state.symbolTo = symbolTo.code;
    },
    [setCurrenciesAsync.rejected]: (state, action) => {
      state.loadingCurrencies = false;
      state.errorCurrencies = action.error.message;
    },
    [setConversionRateAsync.pending]: (state) => {
      state.loadingConversion = true;
      state.errorConversion = null;
    },
    [setConversionRateAsync.fulfilled]: (state, action) => {
      state.loadingConversion = false;
      const direction = action.payload.direction;
      const rate = action.payload.rate;
      state.rate = rate;
      state.direction = direction;
      state.lastUpdated = action.payload.lastUpdated;
      state.errorConversion = null;
      if (direction === 'from') {
        state.amountTo = (state.amountFrom * rate).toFixed(4);
      } else {
        state.amountFrom = (state.amountTo * rate).toFixed(4);
      }
    },
    [setConversionRateAsync.rejected]: (state, action) => {
      state.loadingConversion = false;
      state.errorConversion = action.error.message;
    },
  }
});

export const {
  setSymbol,
  setAmount,
} = converterSlice.actions;

// Selectors.
export const selectTargetAmount = (state) => {
  return state.sourceAmount / state.rate
}

export const selectCurrencies = (state) => state.converter.currencies
export const selectCurrenciesError = (state) => state.converter.errorCurrencies
export const selectCurrenciesLoading = (state) => state.converter.loadingCurrencies
export const selectSymbolFrom = (state) => state.converter.symbolFrom
export const selectSymbolTo = (state) => state.converter.symbolTo
export const selectAmountFrom = (state) => state.converter.amountFrom
export const selectAmountTo = (state) => state.converter.amountTo
export const selectConversionError = (state) => state.converter.errorConversion
export const selectConversionLoading = (state) => state.converter.loadingConversion
export const selectRate = (state) => state.converter.rate
export const selectLastUpdated = (state) => state.converter.lastUpdated;
export const selectDirection = (state) => state.converter.direction;

export const converterReducer = converterSlice.reducer;
