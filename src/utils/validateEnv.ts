import { cleanEnv, str, port } from "envalid";
import { JsonWebTokenError } from "jsonwebtoken";
function validateEnv() {
  cleanEnv(process.env, {
    NODE_ENV: str({ choices: ["developement", "production"] }),
    PORT: port({ default: 3000 }),
    MONGO_PASSWORD: str(),
    MONGO_URL: str(),
    MONGO_USER: str(),
    JWT_SECRET: str(),
  });
}
export default validateEnv;
