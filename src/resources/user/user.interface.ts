import { Document } from "mongoose";

export default interface User extends Document {
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  token: string;
  firstName: string;
  secondName: string;
  phoneNumber: string;
  comparePassword(password: string): Promise<boolean>;
}
