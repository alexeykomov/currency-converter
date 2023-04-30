export const lastUpdatedDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);

  return formattedDate;

}
