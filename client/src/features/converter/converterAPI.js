export const fetchCurrencies = async (user) => {
  try {
    const response = await fetch(`/api/currency/symbols`, {
      headers: {
        'authorization': `Bearer ${await user.getIdToken()}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}, body: ${await response.text()}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    const friendlyErrorMessage = `Something went wrong while fetching currencies. Please try again later. Reason: ${error.message}`;
    console.error(`${friendlyErrorMessage} Error: ${error.message}`);
    throw new Error(friendlyErrorMessage);
  }
}


export const fetchConversionRate = async (baseCurrency, targetCurrency, user) => {
  try {
    const response = await fetch(`/api/currency/pair?baseCurrency=${baseCurrency}&targetCurrency=${targetCurrency}`, {
      headers: {
        'authorization': `Bearer ${await user.getIdToken()}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}, body: ${await response.text()}`);
    }
    const data = await response.json();
    const rates = data.rates;
    const lastUpdated = data.lastUpdated;
    const res = rates.find(d => d[0] === targetCurrency)
    return res && lastUpdated && {
      rate: res[1],
      lastUpdated: new Date(lastUpdated)
    };
  } catch (error) {
    const friendlyErrorMessage = `Something went wrong while doing conversion. Please try again later. Reason: ${error.message}`;
    console.error(`${friendlyErrorMessage} Error: ${error.message}`);
    throw new Error(friendlyErrorMessage);
  }
}
