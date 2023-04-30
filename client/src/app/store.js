import { configureStore } from '@reduxjs/toolkit';
import { converterReducer } from '../features/converter/converterSlice';
import { historicalReducer } from '../features/historical/historicalSlice';
import { todayReducer } from '../features/today/todaySlice';

export const store = configureStore({
  reducer: {
    converter: converterReducer,
    historical: historicalReducer,
    today: todayReducer,
  },
});
