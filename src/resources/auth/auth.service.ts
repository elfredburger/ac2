import UserModel from "../user/user.model";
import User from "../user/user.interface";
import token from "../../utils/token";
import HttpException from "../../utils/exceptions/http.exception";
import { error } from "console";
import Token from "../../utils/interfaces/token.interface";
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
  public async refresh(tokenInfo: string): Promise<String | Error> {
    const user = await this.user.findOne({ token: tokenInfo });
    if (!user) {
      throw new Error("User not found");
    }
    const newToken = await token.createToken(user, "7d");
    await this.user.findOneAndUpdate(
      { token: tokenInfo },
      { token: newToken },
      { new: true }
    );
    return newToken;
  }
  public async login(email: string, password: string): Promise<User | Error> {
    const userInfo = await this.user.findOne({ email: email });
    if (!userInfo) {
      throw new Error("User not found");
    }
    if (await userInfo.comparePassword(password)) {
      await this.user.findOneAndUpdate(
        { email: email },
        { token: token.createToken(userInfo) }
      );
      const updatedUser = (await this.user.findOne({ email: email })) as User;
      return updatedUser;
    } else {
      throw new Error("Wrong password");
    }
  }
  public async logout(token: string): Promise<String | Error> {
    const user = await this.user.findOne({ token: token });
    if (!user) {
      throw new Error("User not found");
    }
    await this.user.findOneAndUpdate(
      { token: token },
      { token: "" },
      { new: true }
    );
    return "User logged out";
  }
  public async verify(tokenInfo: string): Promise<Token | Error> {
    const verify = await token.verifyToken(tokenInfo);
    return verify;
  }
}
export default AuthService;
