import User from "../resources/user/user.interface";
import Company from "../resources/company/company.interface";
declare global {
  namespace Express {
    export interface Request {
      user: User;
      company: Company;
    }
  }
}
