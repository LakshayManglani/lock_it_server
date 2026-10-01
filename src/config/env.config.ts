import { configDotenv } from "dotenv";
import { cleanEnv, port, str } from "envalid";

configDotenv({
  path: "./.env",
});

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["production"],
    default: "production",
  }),
  PORT: port({ default: 8000 }),
});

export default env;
