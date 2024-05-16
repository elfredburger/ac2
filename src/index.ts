import "dotenv/config";
import "module-alias/register";
import validateEnv from "./utils/validateEnv";
import App from "./app";
import UserController from "./resources/user/user.controller";
import AuthController from "./resources/auth/auth.controller";
import CompanyController from "./resources/company/company.controller";
validateEnv();
const app = new App(
  [new AuthController(), new UserController(), new CompanyController()],
  Number(process.env.PORT)
);

app.listen();
