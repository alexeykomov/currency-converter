import React from 'react';
import {useSelector} from "react-redux";
import {
  selectRate,
  selectSymbolFrom,
  selectSymbolTo,
  selectLastUpdated,
  selectDirection,
  selectConversionError, selectConversionLoading
} from "../converterSlice";
import {lastUpdatedDate} from "../utils";
import styles from './Info.module.css';

export const Info = () => {
  const lastUpdated = useSelector(selectLastUpdated);
  const rate = useSelector(selectRate);
  const symbolFrom = useSelector(selectSymbolFrom);
  const symbolTo = useSelector(selectSymbolTo);
  const direction = useSelector(selectDirection);
  const conversionError = useSelector(selectConversionError);
  const conversionLoading = useSelector(selectConversionLoading);

  return <div className={styles.root}>
    {(() => {
      if (conversionError) {
        return <div>
          {conversionError}
        </div>
      }
      if (conversionLoading) {
        return <div> Loading...</div>
      }
      return <>
        <h6 className={styles.header}>{`Your rate:`}</h6>
        <div
            className={styles['main-info']}>{`${direction === 'from' ? symbolFrom : symbolTo} ${1} = ${direction === 'from' ? symbolTo : symbolFrom} ${rate}`}
        </div>
        <div className={styles['additional-info']}>
          {`Last updated ${lastUpdatedDate(lastUpdated)}`}
        </div>
      </>
    })()}
  </div>
}
