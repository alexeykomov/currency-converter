import React, {useContext, useEffect} from "react";
import styles from './TodaysRates.module.css';
import {useDispatch, useSelector} from "react-redux";
import {UserContext} from "../../components/Authorized/Authorized";
import {
  selectConversionError,
  selectConversionLoading,
  selectCurrencies,
  selectCurrenciesError,
  selectCurrenciesLoading,
  selectRate
} from "../converter/converterSlice";
import {
  selectTodayRates,
  selectTodayRatesError, selectTodayRatesLoading,
  setTodayRatesAsync
} from "./todaySlice";
import clsx from "clsx";

export const TodaysRates = () => {
  const todayRates = useSelector(selectTodayRates);
  const rate = useSelector(selectRate);
  const todayRatesError = useSelector(selectTodayRatesError);
  const todayRatesLoading = useSelector(selectTodayRatesLoading);
  const user = useContext(UserContext);
  const dispatch = useDispatch();
  const conversionError = useSelector(selectConversionError);
  const conversionLoading = useSelector(selectConversionLoading);
  const currenciesError = useSelector(selectCurrenciesError);
  const currenciesLoading = useSelector(selectCurrenciesLoading);
  const currencies = useSelector(selectCurrencies);

  useEffect(() => {
    if (rate && currencies && currencies.length) {
      dispatch(setTodayRatesAsync({
        user,
      }))
    }
  }, [rate, currencies && currencies.length]);

  if (todayRatesError || conversionError || currenciesError) {
    return <div className={styles.loading}>
      {todayRatesError || conversionError || currenciesError}
    </div>
  }
  if (!todayRates || todayRatesLoading || conversionLoading || currenciesLoading) {
    return <div className={styles.loading}>Loading...</div>
  }

  return <dl className={styles.root}>
    {todayRates.map((r, index, list) => <li
        className={clsx(styles.rateItem, index === list.length - 1 && styles.rateItemlast)}>
      <dt>{r[0]}</dt>
      <dd>{r[1]}</dd>
    </li>)}
  </dl>

};
