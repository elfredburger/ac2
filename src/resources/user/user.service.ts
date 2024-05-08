import UserModel from "./user.model";
import User from "./user.interface";
import token from "@utils/token";
class UserService {
  private user = UserModel;

  public async create(email: string, password: string): Promise<User> {
    const createdUser = await this.user.create({ email, password });
    return createdUser;
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
}
export default UserService;
