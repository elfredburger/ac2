import { Router, Request, Response, NextFunction } from "express";
import Controller from "@utils/interfaces/controller.interface";
import HttpException from "@utils/exceptions/http.exception";
import validationMiddleware from "@middleware/validation.middleware";
import validate from "@resources/user/user.validation";
import AuthService from "@resources/auth/auth.service";
import authenticated from "@middleware/authenticated.middleware";
import User from "@resources/user/user.interface";
import { error } from "console";
import { JsonWebTokenError } from "jsonwebtoken";
import errorMiddleware from "@middleware/error.middleware";
import rbacMiddleware from "@middleware/rbac.middleware";
class AuthController implements Controller {
  public path = "/auth";
  public router = Router();
  private AuthService = new AuthService();

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
    this.router.get(
      `${this.path}/get`,
      authenticated,
      (req: Request, res: Response, next: NextFunction) => {
        rbacMiddleware(req, res, next, "delete_company");
      },
      this.get
    );
    this.router.post(`${this.path}/logout`, authenticated, this.logout);
    this.router.post(`${this.path}/refresh`, authenticated, this.refresh);
    this.router.get(`${this.path}/buyer`, authenticated, this.buyerRoleCheck);
  }
  private buyerRoleCheck = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {};
  private logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    this.AuthService.logout(
      req.headers.authorization?.replace("Bearer ", "") as string
    );
    res.status(200).json("logged out");
  };
  private refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const refreshToken = req.headers.authorization?.replace(
      "Bearer ",
      ""
    ) as string;
    try {
      const token = await this.AuthService.refresh(refreshToken);
      res.status(200).json({ token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      next(new HttpException(400, error.message));
    }
  };

  private get = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      await authenticated(req, res, next);

      res.status(200).json("Secret data");
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;
      const token = await this.AuthService.login(email, password);
      res.status(200).json({ token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      next(new HttpException(400, error.message));
    }
  };

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { email, password } = req.body;
    try {
      const token = await this.AuthService.create(email, password);
      res.status(201).json({ token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      next(new HttpException(400, error.message));
    }
  };
}

export default AuthController;
