export const fetchTodayRates = async (baseCurrency, targetCurrencies, user) => {
  try {
    const response = await fetch(`/api/currency/latest?baseCurrency=${baseCurrency}&targetCurrencies=${targetCurrencies.join()}`,{
      headers: {
        'authorization': `Bearer ${await user.getIdToken()}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}, body: ${await response.text()}`);
    }
    const data = await response.json();
    return data.rates;
  } catch (error) {
    const friendlyErrorMessage = `Something went wrong fetching today's rates. Please try again later. Reason: ${error.message}`;
    console.error(`${friendlyErrorMessage} Error: ${error.message}`);
    throw new Error(friendlyErrorMessage);
  }
}
