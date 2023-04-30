import {useSelector} from "react-redux";
import {
  selectCurrencies,
  selectDirection,
  selectRate,
  selectSymbolFrom,
  selectSymbolTo
} from "../../converter/converterSlice";
import React from "react";
import {selectTodayRates} from "../todaySlice";

export const TodaysRatesHeaderContent = () => {
  const todayRates = useSelector(selectTodayRates);
  const rate = useSelector(selectRate);
  const currencies = useSelector(selectCurrencies);


  const symbolFrom = useSelector(selectSymbolFrom);
  const symbolTo = useSelector(selectSymbolTo);
  const direction = useSelector(selectDirection);
  return <div>
    {rate && currencies && currencies.length &&
        todayRates && todayRates.length
        && `${1} ${direction === 'from' ? symbolFrom : symbolTo} =`}
  </div>
}
