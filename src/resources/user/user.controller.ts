import { Router, Request, Response, NextFunction } from "express";
import Controller from "../../utils/interfaces/controller.interface";
import HttpException from "../../utils/exceptions/http.exception";
import rbacMiddleware from "../../middleware/rbac.middleware";
import validationMiddleware from "../../middleware/validation.middleware";
import validate from "../../resources/user/user.validation";
import UserService from "../../resources/user/user.service";
import authenticated from "../../middleware/authenticated.middleware";
class UserController implements Controller {
  public path = "/users";
  public router = Router();
  private UserService = new UserService();
  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.get(
      `${this.path}/userinfo`,
      authenticated,

      this.userInfo
    );
    this.router.patch(`${this.path}/update`, authenticated, this.update);
    this.router.delete(`${this.path}/delete`, authenticated, this.delete);
  }

  private userInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const user = await this.UserService.getUserInfo(
        req.headers.authorization?.replace("Bearer ", "") as string
      );
      res.status(200).json(user);
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const user = await this.UserService.updateUser(
        req.headers.authorization?.replace("Bearer ", "") as string,
        req.body.user
      );
      res.status(200).json(user);
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
  private delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const user = await this.UserService.deleteUser(
        req.headers.authorization?.replace("Bearer ", "") as string
      );
      res.status(200).json(user);
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}
export default UserController;
