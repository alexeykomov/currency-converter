import { useState } from 'react';
import styles from './SegmentedControl.module.css';
import clsx from 'clsx';
import React from 'react';
import {getUid} from "../../util/uid";

export const SegmentedControl = ({
  options,
  onOptionSelect,
  selectedOption,
    renderLabel
}) => {
  const [uid] = useState(getUid());

  const handleChange = (e) => {
    if (e.target.checked) {
      const value = e.target.value;
      onOptionSelect(value);
    }
  };

  return (
    <div className={styles.root} data-testid={`segmented-control-${uid}`}>
      <div className={styles['label-cont']}>
        {options.map((option, index) => {
          const id = `id-${option.value}-${uid}`;
          const checked = option.value === selectedOption;
          return (
            <React.Fragment key={option.value}>
              <input
                type="radio"
                id={id}
                name={`segmented-control-${uid}`}
                value={option.value}
                className={styles.input}
                onChange={handleChange}
                checked={checked}
                data-testid={`segmented-control-input-${uid}-${index}`}
              />
              <label
                htmlFor={id}
                className={clsx(
                  styles.label,
                  index === options.length - 1 && styles['label-last']
                )}
                data-testid={`segmented-control-label-${uid}-${index}`}
              >
                {renderLabel(option.label, checked)}
              </label>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
