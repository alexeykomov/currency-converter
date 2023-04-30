import React, {useContext, useEffect} from 'react';
import {InputWithSelect} from "./InputWithSelect/InputWithSelect";
import {
  selectAmountFrom,
  selectAmountTo,
  selectConversionError,
  selectRate, selectConversionLoading,
  selectSymbolFrom, selectSymbolTo, selectCurrencies, selectCurrenciesError,
  selectCurrenciesLoading,
  setConversionRateAsync,
  setCurrenciesAsync, selectLastUpdated
} from "./converterSlice";
import styles from './Converter.module.css'
import {useDispatch, useSelector} from "react-redux";
import {UserContext} from "../../components/Authorized/Authorized";
import {Info} from "./Info/Info";

export const Converter = () => {
  const currencies = useSelector(selectCurrencies);
  const currenciesError = useSelector(selectCurrenciesError);
  const currenciesLoading = useSelector(selectCurrenciesLoading);

  const amountFrom = useSelector(selectAmountFrom);
  const amountTo = useSelector(selectAmountTo);
  const symbolFrom = useSelector(selectSymbolFrom);
  const symbolTo = useSelector(selectSymbolTo);
  const conversionError = useSelector(selectConversionError);
  const conversionLoading = useSelector(selectConversionLoading);
  const lastUpdated = useSelector(selectLastUpdated);
  const rate = useSelector(selectRate);
  const user = useContext(UserContext);

  const dispatch = useDispatch();
  const onChangeFrom = (symbol, amount) => {
    dispatch(setConversionRateAsync({
      user, symbol, amount, direction: 'from'
    }))
  }
  const onChangeTo = (symbol, amount) => {
    console.log('onChangeTo: ', {symbol, amount});
    dispatch(setConversionRateAsync({
      user, symbol, amount, direction: 'to'
    }))
  }
  useEffect(() => {
    if (!currencies && !currenciesError && !currenciesLoading) {
      dispatch(setCurrenciesAsync(user))
    }
  }, [currencies, currenciesError, currenciesLoading]);
  useEffect(() => {
    if (currencies && currencies.length) {
      dispatch(setConversionRateAsync({
        user, symbol: symbolFrom, amount: amountFrom, direction: 'from'
      }));
    }
  }, [currencies && currencies.length])
  return <div className={styles.root}>{
    (() => {
      if (currenciesError) {
        return <div className={styles.loading}>
          {currenciesError}
        </div>
      }
      if (!currencies || currenciesLoading) {
        return <div className={styles.loading}>Loading...</div>
      }
      return <>
        <div className={styles['input-cont']}>
          <InputWithSelect fieldType="from" currencySymbol={symbolFrom}
                           currencyValue={amountFrom}
                           currencyOptions={currencies}
                           onChange={onChangeFrom}/>
          <InputWithSelect fieldType="to" currencySymbol={symbolTo}
                           currencyValue={amountTo}
                           currencyOptions={currencies}
                           onChange={onChangeTo}/>
        </div>
        <hr className={styles['divider']}/>
        <Info/>
      </>
    })()
    }
  </div>
}
