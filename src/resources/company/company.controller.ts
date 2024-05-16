import { Router, Request, Response, NextFunction } from "express";
import Controller from "../../utils/interfaces/controller.interface";
import HttpException from "../../utils/exceptions/http.exception";
import authenticated from "../../middleware/authenticated.middleware";
import companyMiddleware from "../../middleware/company.middleware";
import Company from "./company.interface";
import CompanyService from "./company.service";
import { cp } from "fs";
class CompanyController implements Controller {
  public path = "/company";
  public router = Router();
  private companyService = new CompanyService();
  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.get(
      `${this.path}/companyinfo/:id`,
      authenticated,

      this.companyinfo
    );
    this.router.patch(`${this.path}/update`, authenticated, this.updateCompany);
    this.router.post(`${this.path}/create`, authenticated, this.create);
    this.router.post(`${this.path}/delete`, authenticated, this.delete);
  }
  private delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const result = await this.companyService.deleteCompany(req.params.id);
      res.status(200).json(result);
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
  private companyinfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const result = await this.companyService.getCompany(req.params.id);
      res.status(200).json(result);
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
  private updateCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const result = await this.companyService.updateCompany(req.body.company);
      res.status(200).json(result);
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    console.log(req);

    try {
      const token = req.headers.authorization?.replace("Bearer ", "") as string;
      const result = await this.companyService.create(req.body.company, token);

      res.status(200).json(result);
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}
export default CompanyController;
