import { configDotenv } from "dotenv";
import { cleanEnv, port, str, makeValidator, num } from "envalid";

configDotenv({
  path: "./.env",
});

const MIN_SECRET_LENGTH = 32;

const cors = makeValidator((value) => {
  if (!value) return "*";
  return value.split(",");
});

const secret = makeValidator((value) => {
  if (value.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `must be at least ${MIN_SECRET_LENGTH} characters, generate one with "openssl rand -hex 32"`
    );
  }
  return value;
});

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["production"],
    default: "production",
  }),
  APP_ENV: str({
    choices: ["development", "production"],
    default: "production",
  }),
  PORT: port({ default: 8000 }),

  DATABASE_URL: str(),

  ACCESS_TOKEN_SECRET: secret(),
  ACCESS_TOKEN_EXPIRES: num({ default: 60 * 60 * 24 }),
  REFRESH_TOKEN_SECRET: secret(),
  REFRESH_TOKEN_EXPIRES: num({ default: 60 * 60 * 24 * 30 }),

  CORS_ORIGIN: cors(),
});

export default env;
