import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;

  NATS_SERVERS: string[];

  FRONTENDS_SERVERS: string[];

  PVT_API_SERVER: string;
  PVT_HASH_SECRET: string;

  DB_PASSWORD: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),

    NATS_SERVERS: joi.array().items(joi.string()).required(),
    FRONTENDS_SERVERS: joi.array().items(joi.string()).required(),

    PVT_API_SERVER: joi.string(),
    PVT_HASH_SECRET: joi.string(),

    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USERNAME: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
  FRONTENDS_SERVERS: process.env.FRONTENDS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,

  natsServers: envVars.NATS_SERVERS,
  frontendServers: envVars.FRONTENDS_SERVERS,

  PvtApiServer: envVars.PVT_API_SERVER,
  PvtHashSecret: envVars.PVT_HASH_SECRET,

  dbPassword: envVars.DB_PASSWORD,
  dbName: envVars.DB_NAME,
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
  dbUsername: envVars.DB_USERNAME,
};
