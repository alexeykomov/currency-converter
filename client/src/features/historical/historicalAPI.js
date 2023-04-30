export const fetchHistorical = async (baseCurrency, targetCurrency, months, user) => {
  try {
    const response = await fetch(`/api/currency/historical?baseCurrency=${baseCurrency}&targetCurrency=${targetCurrency}&months=${months}`, {
      headers: {
        'authorization': `Bearer ${await user.getIdToken()}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}, body: ${await response.text()}`);
    }
    const data = await response.json();
    const adaptedData = data.map(d => ({name: d[0], value: d[1]}));
    return adaptedData;
  } catch (error) {
    const friendlyErrorMessage = `Something went wrong while fetching historical data. Please try again later. Reason: ${error.message}`;
    console.error(`${friendlyErrorMessage} Error: ${error.message}`);
    throw new Error(friendlyErrorMessage);
  }
}
