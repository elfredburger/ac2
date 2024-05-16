import { Document } from "mongoose";

export default interface Company extends Document {
  companyCreator: string;
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;
  companyUsers: [{ userId: String; roles: [String]; permissions: [String] }];
}
