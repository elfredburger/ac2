import UserModel from "./user.model";
import User from "./user.interface";
import token from "@utils/token";
class UserService {
  private user = UserModel;
  public async findOne(email: string): Promise<User | null> {
    const user = await this.user.findOne({ email: email });
    return user;
  }
}
