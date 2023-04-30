import {
  SegmentedControl
} from "../../../components/SegmentedControl/SegmentedControl";
import React from "react";
import styles from './HeaderTabs.module.css'
import clsx from "clsx";


export const HeaderTabs = ({currentTab, onTabChanged}) => {

  const onOptionSelect = (tab) => {
    onTabChanged(tab)
  }
  return <SegmentedControl
      options={[
        {value: 'currency_converter', label: 'Currency converter'},
        {value: 'historical_rates', label: 'Historical rates'},
      ]}
      onOptionSelect={onOptionSelect}
      selectedOption={currentTab}
      renderLabel={(text, checked) => <div
          className={clsx(styles.tab, checked && styles['tab-checked'])}>{text}</div>}
  />
}
