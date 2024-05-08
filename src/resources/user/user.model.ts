import { Schema, model } from "mongoose";
import User from "./user.interface";

import * as argon from "argon2";

const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await argon.hash(this.password);
  console.log(hash);
  this.password = hash;
  next();
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await argon.verify(this.password, password);
};

export default model<User>("User", userSchema);
