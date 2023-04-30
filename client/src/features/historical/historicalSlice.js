import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchHistorical} from "./historicalAPI";


export const initialState = {
  months: '1',
  loadingHistorical: false,
  errorHistorical: null,
  historicalData: null
};


// Thunks.
export const setHistoricalAsync = createAsyncThunk(
    'historical/setHistorical',
    async ({user, months}, thunkAPI) => {
      thunkAPI.dispatch(setMonths(months));
      const stateConverter = thunkAPI.getState().converter;
      const state = thunkAPI.getState().historical;

      const direction = stateConverter.direction;
      const symbolFrom = direction === 'from' ? stateConverter.symbolFrom : stateConverter.symbolTo;
      const symbolTo = direction === 'from' ? stateConverter.symbolTo : stateConverter.symbolFrom;
      if (!symbolFrom || !symbolTo) {
        throw new Error('Undefined currencies.');
      }

      const response = await fetchHistorical(symbolFrom, symbolTo, state.months, user);
      if (!response) {
        throw new Error('No response.');
      }
      return response;
    }
);

export const historicalSlice = createSlice({
  name: 'historical',
  initialState: () => initialState,
  reducers: {
    setMonths: (state, action) => {
      state.months = action.payload;
    },
  },
  extraReducers: {
    [setHistoricalAsync.pending]: (state) => {
      state.loadingHistorical = true;
      state.errorHistorical = null;
    },
    [setHistoricalAsync.fulfilled]: (state, action) => {
      state.loadingHistorical = false;
      state.historicalData = action.payload;
    },
    [setHistoricalAsync.rejected]: (state, action) => {
      state.loadingHistorical = false;
      state.errorHistorical = action.error.message;
    },
  }
});

export const {
  setMonths,
} = historicalSlice.actions;

// Selectors.
export const selectMonths = (state) => state.historical.months;
export const selectHistoricalData = (state) => state.historical.historicalData;
export const selectHistoricalError = (state) => state.historical.errorHistorical;
export const selectHistoricalLoading = (state) => state.historical.loadingHistorical;


export const historicalReducer = historicalSlice.reducer;
