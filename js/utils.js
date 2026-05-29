export function formatPriceUsd(priceDigits) {
  if (!priceDigits) {
    return "-";
  }
  const numericValue = Number.parseInt(String(priceDigits).replace(/\s/g, ""), 10);
  if (Number.isNaN(numericValue)) {
    return `$${priceDigits}`;
  }
  return `$${numericValue.toLocaleString("en-US")}`;
}

export function extractErrorMessage(error, fallbackMessage = "An error has occured. Try later.") {
  const serverMessage = error.response?.data?.error;
  if (typeof serverMessage === "string") {
    return serverMessage;
  }
  if (error.message) {
    return error.message;
  }
  return fallbackMessage;
}
