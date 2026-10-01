import { configDotenv } from "dotenv";
import { cleanEnv, port, str, makeValidator } from "envalid";

configDotenv({
  path: "./.env",
});

const cors = makeValidator((value) => {
  if (!value) return "*";
  return value.split(",");
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

  CORS_ORIGIN: cors(),
});

export default env;
