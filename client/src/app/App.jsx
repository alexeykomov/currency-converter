import React from 'react';
import './App.module.css';
import {useSmallScreenLayout} from "../hooks/useSmallScreenLayout";
import styles from "./App.module.css";
import {Header} from "../components/Header/Header";
import {Authorized} from "../components/Authorized/Authorized";
import {Converter} from "../features/converter/Converter";
import {
  ConverterAndRatesBlock
} from "./ConverterAndRatesBlock/ConverterAndRatesBlock";
import {TodayRatesBlock} from "./TodayRatesBlock/TodayRatesBlock";
import {Historical} from "../features/historical/Historical";

function App() {
  const smallScreenLayout = useSmallScreenLayout();
  return (
      <Authorized>
        <div className={styles.app} data-testid="app">
          <Header fixed={smallScreenLayout}/>

          <div className={styles['App-body']}>
            <ConverterAndRatesBlock />
            <div className={styles.spacer}/>
            <TodayRatesBlock />
          </div>
        </div>
      </Authorized>
  );
}

export default App;
