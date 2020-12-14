import { config as loadEnv } from 'dotenv';
import { cleanEnv, str, url, CleanEnv } from 'envalid';
import { Url } from 'url';
import { ResponseType } from './types/common';

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
    RESPONSE_TYPE: str({ default: ResponseType.Basic }),
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
  RESPONSE_TYPE: ResponseType;
}> &
  CleanEnv;
