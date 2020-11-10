import { config as loadEnv } from 'dotenv';
import { cleanEnv, str, url, CleanEnv } from 'envalid';
import { Url } from 'url';

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
    CONSTRAINT_ID: str({ default: null }),
    SESSION_KEY: str({ default: null }),
  },
  {
    dotEnvPath: null,
    strict: true,
  },
);

export type AppConfig = Readonly<{
  STAGE: string;
  REGION: string;
  LOOKUP_API_URL: Url;
  CONSTRAINT_API_URL: Url;
  CONSTRAINT_ID: string;
  SESSION_KEY: string;
}> &
  CleanEnv;
