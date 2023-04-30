import React from 'react';
import styles from './TodayRatesBlock.module.css'
import {TodaysRates} from "../../features/today/TodaysRates";
import {
  TodaysRatesHeaderContent
} from "../../features/today/TodaysRatesHeaderContent/TodaysRatesHeaderContent";
export const TodayRatesBlock = () => {
  return <div className={styles.root}>
    <header className={styles.header}>
      <div>Today's rates</div>
      <TodaysRatesHeaderContent />
    </header>
    <div className={styles.body}>
      <TodaysRates />
    </div>
  </div>
}
