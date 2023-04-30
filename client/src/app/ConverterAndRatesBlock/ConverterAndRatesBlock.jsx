import React, {useState} from 'react';
import styles from './ConverterAndRatesBlock.module.css'
import {Converter} from "../../features/converter/Converter";
import {
  SegmentedControl
} from "../../components/SegmentedControl/SegmentedControl";
import {HeaderTabs} from "./HeaderTabs/HeaderTabs";
import {Historical} from "../../features/historical/Historical";

export const ConverterAndRatesBlock = () => {
  const [currentTab, setCurrentTab] = useState('currency_converter');
  return <div className={styles.root}>
    <header className={styles.header}>
      <HeaderTabs currentTab={currentTab} onTabChanged={setCurrentTab}/>
    </header>
    {currentTab === 'currency_converter' ? <Converter/> : <Historical/>}
  </div>
}
