import {
  SegmentedControl
} from "../../../components/SegmentedControl/SegmentedControl";
import React, {useContext} from "react";
import styles from './MonthsTabs.module.css'
import clsx from "clsx";
import {useDispatch, useSelector} from "react-redux";
import {selectMonths, setHistoricalAsync} from "../historicalSlice";
import {
  selectDirection, selectSymbolFrom,
  selectSymbolTo,
  setConversionRateAsync
} from "../../converter/converterSlice";
import {UserContext} from "../../../components/Authorized/Authorized";

export const MonthsTabs = () => {
  const months = useSelector(selectMonths);
  const symbolTo = useSelector(selectSymbolTo);
  const symbolFrom = useSelector(selectSymbolFrom);
  const direction = useSelector(selectDirection);
  const dispatch = useDispatch();
  const user = useContext(UserContext);
  const onOptionSelect = (months) => {
    dispatch(setHistoricalAsync({
      user, months,
    }))
  }
  return <>
    <d><div className={styles['tabs-wrapper']}><SegmentedControl
        options={[
          {value: '1', label: 'Last month'},
          {value: '3', label: 'Last 3 months'},
          {value: '6', label: 'Last 6 months'},
          {value: '12', label: 'Last 12 months'},
        ]}
        onOptionSelect={onOptionSelect}
        selectedOption={months}
        renderLabel={(text, checked) => <div
            className={clsx(styles.tab, checked && styles['tab-checked'])}>{text}</div>}
    /></div>
      <div className={styles.divider}/>
      <div className={styles.info}>{`${direction === 'from' ? symbolFrom : symbolTo} vs ${direction === 'from' ? symbolTo : symbolFrom}`}</div>
    </d>
  </>
}
