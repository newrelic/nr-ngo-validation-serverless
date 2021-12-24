const allowedOrigins = ["newrelic.com", "newrelic.org"];

export const checker = (value: string | string[]) =>
  allowedOrigins.some((element) => value.includes(element));
