const allowedOrigins = ["newrelic.com", "newrelic.org"];

export const checker = (value: string | string[]): boolean =>
  allowedOrigins.some((element) => value.includes(element));
