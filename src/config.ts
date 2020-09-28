import { config as loadEnv } from 'dotenv';
import { cleanEnv, str, url } from 'envalid';

const dotEnvPath = process.env.NODE_ENV === 'test' ? '.test.env' : '.env';

export const config = cleanEnv(
  {
    ...loadEnv({ path: dotEnvPath }).parsed,
    ...process.env,
  },
  {
    STAGE: str(),
    REGION: str(),
    LOOKUP_API_URL: url(),
    CONSTRAINT_API_URL: url(),
    CONSTRAINT_ID: str(),
    SESSION_KEY: str(),
  },
  {
    dotEnvPath: null,
    strict: true,
  }
);
