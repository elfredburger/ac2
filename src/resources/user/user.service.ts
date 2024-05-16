import UserModel from "./user.model";
import User from "./user.interface";
class UserService {
  private user = UserModel;
  public async getUserInfo(token: string): Promise<User | Error> {
    const user = await this.user.findOne({ token: token }).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
  public async updateUser(token: string, data: any): Promise<User | Error> {
    throw new Error("Not implemented");
  }
}
export default UserService;
