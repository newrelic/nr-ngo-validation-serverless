import pino from 'pino';

export const logger = pino({
  name: 'ngo-validation-service',
  level: 'debug',
});
