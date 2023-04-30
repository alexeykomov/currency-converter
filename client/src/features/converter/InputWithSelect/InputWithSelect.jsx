import React, {useEffect, useRef, useState} from "react";
import styles from './InputWithSelect.module.css';

const FieldTypeToLabel = {
  'from': 'From',
  'to': 'To'
}

export const InputWithSelect = ({
                                  fieldType,
                                  currencySymbol,
                                  currencyValue,
                                  currencyOptions,
                                  onChange,
                                }) => {
  const [amount, setAmount] = useState(currencyValue);
  const [interacted, setInteracted] = useState(false);
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState(currencySymbol);
  const inputRef = useRef(null);
  const handleSelect = (event) => {
    const value = event.target.value;
    setSelectedCurrencySymbol(value);
    setInteracted(true);
    const inputValue = inputRef.current?.value;
    setAmount(inputValue);
  }
  const handleInput = (event) => {
    const value = event.target.value;
    setInteracted(true);
    setAmount(value);
  }
  useEffect(() => {
    if (interacted) {
      onChange(selectedCurrencySymbol, amount)
    }
  }, [selectedCurrencySymbol, amount, interacted]);
  return (
      <div className={styles['root']}>
        <div className={styles['input-box']}>
          <label className={styles.label} htmlFor={fieldType}>{FieldTypeToLabel[fieldType]}</label>
          <input className={styles.input} id={fieldType} type="number" value={currencyValue} ref={inputRef}
                 onChange={handleInput}/>
        </div>
        <select className={styles.select} value={currencySymbol}
                onChange={handleSelect}>
          {currencyOptions.map(currencyOption =>
              <option key={currencyOption.code}
                  value={currencyOption.code}>{`${currencyOption.name} (${currencyOption.code})`}</option>
          )}
        </select>
      </div>
  );
};
