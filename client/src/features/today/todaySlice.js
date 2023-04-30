import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchTodayRates} from "./todayAPI";


const ORIGINAL_TARGET_CURRENCIES = ['EUR', 'GBP', 'CAD', 'MXN', 'JPY'];

export const initialState = {
  loadingToday: false,
  errorToday: null,
  todayRates: null,
  targetCurrencies: ORIGINAL_TARGET_CURRENCIES,
  errorTodayRates: null,
  loadingTodayRates: false,
};


// Thunks.
export const setTodayRatesAsync = createAsyncThunk(
    'historical/setTodayRates',
    async ({user}, thunkAPI) => {
      thunkAPI.dispatch(setTargetCurrencies(ORIGINAL_TARGET_CURRENCIES))
      const stateConverter = thunkAPI.getState().converter;
      const state = thunkAPI.getState().today;

      const direction = stateConverter.direction;
      const symbolFrom = direction === 'from' ? stateConverter.symbolFrom : stateConverter.symbolTo;
      let targetCurrencies = state.targetCurrencies.slice();
      const indexOfSymbolFrom = targetCurrencies.indexOf(symbolFrom);
      if (indexOfSymbolFrom >= 0) {
        targetCurrencies.splice(indexOfSymbolFrom, 1, 'USD');
        thunkAPI.dispatch(setTargetCurrencies(targetCurrencies))
      }
      if (!symbolFrom) {
        throw new Error('Undefined currencies.');
      }
      const response = await fetchTodayRates(symbolFrom, targetCurrencies, user);
      if (!response) {
        throw new Error('No response.')
        return;
      }
      return response;
    }
);

export const todaySlice = createSlice({
  name: 'today',
  initialState: () => initialState,
  reducers: {
    setTargetCurrencies: (state, action) => {
      state.targetCurrencies = action.payload;
    },
  },
  extraReducers: {
    [setTodayRatesAsync.pending]: (state) => {
      state.loadingTodayRates = true;
      state.errorTodayRates = null;
    },
    [setTodayRatesAsync.fulfilled]: (state, action) => {
      state.loadingTodayRates = false;
      state.todayRates = action.payload;
    },
    [setTodayRatesAsync.rejected]: (state, action) => {
      state.loadingTodayRates = false;
      state.errorTodayRates = action.error.message;
    },
  }
});

export const {
  setTargetCurrencies,
} = todaySlice.actions;

// Selectors.
export const selectTargetCurrencies = (state) => state.today.targetCurrencies;
export const selectTodayRates = (state) => state.today.todayRates;

export const selectTodayRatesError = (state) => state.today.errorTodayRates
export const selectTodayRatesLoading = (state) => state.today.loadingTodayRates

export const todayReducer = todaySlice.reducer;
