import React from 'react';
import styles from './Header.module.css';
import clsx from 'clsx';

export const Header = ({ fixed }) => {
  return (
    <header
      className={clsx(
        styles['app-header'],
        fixed && styles['app-header-fixed']
      )}
      data-testid="app-header"
    >
      Your Exchange Rate Application
    </header>
  );
};
