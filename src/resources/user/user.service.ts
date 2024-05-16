import UserModel from "./user.model";
import User from "./user.interface";
import HttpException from "../../utils/exceptions/http.exception";
class UserService {
  private user = UserModel;
  public async getUserInfo(token: string): Promise<User | HttpException> {
    const user = await this.user.findOne({ token: token }).select("-password");
    if (!user) {
      throw new HttpException(400, "User not found");
    }
    return user;
  }
  public async updateUser(token: string, user: User): Promise<User | Error> {
    const updatedUser = (await this.user.findOneAndUpdate(
      { token: token },
      user,
      { new: true }
    )) as User;
    if (!updatedUser) {
      throw new HttpException(400, "User not updated");
    }

    return updatedUser;
  }
  public async deleteUser(token: string): Promise<String | Error> {
    const deletedUser = await this.user.deleteOne({ token: token });

    if (deletedUser.deletedCount <= 0) {
      throw new HttpException(400, "User not deleted");
    }
    return "User deleted successfully";
  }
}
export default UserService;
