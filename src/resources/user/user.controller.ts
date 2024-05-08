import { Router, Request, Response, NextFunction } from "express";
import Controller from "@utils/interfaces/controller.interface";
import HttpException from "@utils/exceptions/http.exception";
import validationMiddleware from "@middleware/validation.middleware";
import validate from "@resources/user/user.validation";
import UserService from "@resources/user/user.service";
import authenticated from "@middleware/authenticated.middleware";
class UserController implements Controller {
  public path = "/users";
  public router = Router();
  private UserService = new UserService();
  constructor() {
    this.initialiseRoutes();
  }
  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}/create`,
      validationMiddleware(validate.create),
      this.create
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(validate.login),
      this.login
    );
    this.router.get(`${this.path}/get`, authenticated, this.get);
  }
  private get = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    if (!req.user) {
      return next(new HttpException(401, "Unauthorized"));
    }
    res.status(200).json(req.user);
  };

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;
      const token = await this.UserService.login(email, password);
      console.log("token is", token);
      return res.status(200).json({ token });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;
      const token = await this.UserService.create(email, password);
      res.send("ok");
      res.status(201).json({ token });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default UserController;
