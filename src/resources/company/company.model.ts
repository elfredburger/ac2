import { Schema, model } from "mongoose";
import Company from "./company.interface";

import * as argon from "argon2";
import { string } from "joi";

const CompanySchema = new Schema<Company>({
  companyCreator: {
    type: String,
  },
  companyName: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  companyEmail: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  companyAddress: {
    type: String,
  },
  companyPhone: {
    type: String,
  },
  companyUsers: {
    type: [{ userId: String, roles: [String], permissions: [String] }],
  },
});

export default model<Company>("company", CompanySchema);
