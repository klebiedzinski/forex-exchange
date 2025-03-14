export const formatApiUrl = (
  currencyPair: string,
  period: "15M" | "1H" | "1D" | "1W" | "1M"
) => {
  const formatDateUTC = (date: Date): string => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}-${hours}:${minutes}`;
  };

  const now = new Date();

  let startDate: string;
  let endDate = formatDateUTC(now);
  let interval: string;
  let periodValue: number;

  switch (period) {
    case "15M":
      startDate = formatDateUTC(new Date(now.getTime() - 15 * 60 * 1000)); // 15 minutes ago
      interval = "minute";
      periodValue = 1;
      break;
    case "1H":
      startDate = formatDateUTC(new Date(now.getTime() - 60 * 60 * 1000)); // 1 hour ago
      interval = "minute";
      periodValue = 1;
      break;
    case "1D":
      startDate = formatDateUTC(new Date(now.getTime() - 24 * 60 * 60 * 1000)); // 1 day ago
      interval = "minute";
      periodValue = 30;
      break;
    case "1W":
      startDate = formatDateUTC(
        new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      ); // 1 week ago
      interval = "hourly";
      periodValue = 1;
      break;
    case "1M":
      startDate = formatDateUTC(
        new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      ); // 1 month ago
      interval = "daily";
      periodValue = 1;
      break;
    default:
      startDate = formatDateUTC(new Date(now.getTime() - 24 * 60 * 60 * 1000)); // 1 day ago
      interval = "minute";
      periodValue = 30;
  }

  const apiUrl = `https://marketdata.tradermade.com/api/v1/timeseries?currency=${currencyPair}&api_key=${
    import.meta.env.VITE_TRADER_MADE_API_KEY
  }&format=records&start_date=${startDate}&end_date=${endDate}&interval=${interval}&period=${periodValue}`;
  return apiUrl;
};
