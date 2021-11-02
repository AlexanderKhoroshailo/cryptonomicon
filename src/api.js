const API_KEY =
  "d292ab80afe360db7e6b81937601515fcf35089d34446168c37c71b530ffd213";

const tickersHandlers = new Map();
//TODO: refactor to use UrlSearchParams
export const loadTickers = () => {
  if (tickersHandlers.size === 0) return;

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickersHandlers.keys(),
    ].join(",")}&tsyms=USB&api_key=${API_KEY}`
  )
    .then((r) => r.json())
    .then((rawData) => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );

      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];
        handlers.forEach((f) => f(newPrice));
      });
    });
};

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(tickersHandlers) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeToTicker = (ticker) => {
  tickersHandlers.delete(ticker)
};

setInterval(loadTickers, 5000);
window.tickers = tickersHandlers;
