import UserModel from "../user/user.model";
import User from "../user/user.interface";
import token from "@utils/token";
import HttpException from "@utils/exceptions/http.exception";
import { error } from "console";
import Token from "@utils/interfaces/token.interface";
class AuthService {
  private user = UserModel;

  public async create(email: string, password: string): Promise<User | Error> {
    const userChecked = await this.user.findOne({ email: email });
    if (userChecked) {
      throw new HttpException(409, "User Already Exists");
    }
    const createdUser = await this.user.create({ email, password });

    return createdUser;
  }
  public async refresh(
    tokenInfo: string,
    userInfo: User
  ): Promise<String | Error> {
    const verify = await token.verifyToken(tokenInfo);
    const user = await this.user.findOne({ email: userInfo.email });
    if (!user) {
      throw new Error("User not found");
    }
    return token.createToken(user, "7d");
  }
  public async login(email: string, password: string): Promise<string | Error> {
    const user = await this.user.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    }
    if (await user.comparePassword(password)) {
      return token.createToken(user);
    } else {
      throw new Error("Wrong password");
    }
  }
  // public async logout(tokenInfo: string): Promise<String | Error> {
  //   if ((await token.verifyToken(tokenInfo)) instanceof Error) {
  //     throw new Error("Invalid token");
  //   }

  //   return token.createToken(tokenInfo);
  // }
  public async verify(tokenInfo: string): Promise<Token | Error> {
    const verify = await token.verifyToken(tokenInfo);
    return verify;
  }
}
export default AuthService;
