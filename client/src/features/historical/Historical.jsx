import React, {useContext, useEffect} from "react";
import {
  AreaChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  Legend,
  Area
} from "recharts";
import {
  SegmentedControl
} from "../../components/SegmentedControl/SegmentedControl";
import {MonthsTabs} from "./MonthsTabs/MonthsTabs";
import styles from './Historical.module.css';
import {useDispatch, useSelector} from "react-redux";
import {
  selectHistoricalData, selectHistoricalError, selectHistoricalLoading,
  selectMonths,
  setHistoricalAsync
} from "./historicalSlice";
import {UserContext} from "../../components/Authorized/Authorized";
import {
  selectCurrencies,
  selectCurrenciesError,
  selectCurrenciesLoading,
  selectRate
} from "../converter/converterSlice";

const CustomTooltip = ({active, payload}) => {
  if (active && payload && payload.length) {
    return (
        <div className="custom-tooltip">
          <p className="label">{`Date: ${payload[0].payload.name}`}</p>
          <p className="value">{`Value: ${payload[0].value}`}</p>
        </div>
    );
  }

  return null;
};

export const Historical = () => {
  const data = useSelector(selectHistoricalData);
  const rate = useSelector(selectRate);
  const months = useSelector(selectMonths);
  const user = useContext(UserContext);
  const dispatch = useDispatch();
  const currenciesError = useSelector(selectCurrenciesError);
  const currenciesLoading = useSelector(selectCurrenciesLoading);
  const historicalError = useSelector(selectHistoricalError);
  const historicalLoading = useSelector(selectHistoricalLoading);
  const currencies = useSelector(selectCurrencies);

  console.log('historicalLoading: ', historicalLoading);

  useEffect(() => {
    if (rate && currencies && currencies.length) {
      dispatch(setHistoricalAsync({
        user, months,
      }))
    }
  }, [rate, currencies && currencies.length]);

  if (currenciesError) {
    return <div className={styles.loading}>
      {currenciesError}
    </div>
  }
  if (!currencies || currenciesLoading) {
    return <div className={styles.loading}>Loading...</div>
  }

  return <div className={styles.root}>
    <MonthsTabs/>
    <>
      {(() => {
        if (historicalError) {
          return <div className={styles['loading-chart']}>
            {historicalError}
          </div>
        }
        if (historicalLoading) {
          return <div className={styles['loading-chart']}>Loading...</div>
        }
        return <div className={styles['chart-wrapper']}><ResponsiveContainer height={190}>
          <ComposedChart
              width={500}
              height={300}
              data={data}
          >
            <CartesianGrid stroke="#ccc"/>
            <XAxis dataKey="name"/>
            <YAxis/>
            <Area type="monotone" dataKey="value"
                  fill="rgba(220, 245, 252, 0.5)"
                  stroke="none"/>
            <Line type="monotone" dataKey="value" stroke="rgba(144, 187, 205)"
                  strokeWidth={2} dot={{r: 4}}/>
          </ComposedChart>
        </ResponsiveContainer></div>
      })()}
    </>
  </div>
};
