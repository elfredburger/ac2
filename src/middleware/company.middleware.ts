import { Request, Response, NextFunction } from "express";
import HttpException from "../utils/exceptions/http.exception";
import userModel from "../resources/user/user.model";
import companyModel from "../resources/company/company.model";
import comproles from "../config/comproles.json";
async function companyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
  permission: string,
  companyId: string
): Promise<Error | void> {
  const token = req.headers.authorization?.split("Bearer ")[1].trim() as string;

  const company = await companyModel.findOne({ _id: companyId });
  const user = await userModel.findOne({ token: token });
  if (!user || !company) {
    return next(new HttpException(401, "user or company not found"));
  }
  const userAcces = company.companyUsers.find(
    (companyUser) => companyUser.userId === user._id
  )!;
  if (!userAcces) {
    next(new HttpException(401, "user not in company"));
  }
  const foundRoles = comproles.roles.filter(
    (role) => role.name in userAcces.roles
  );

  const userPermissions = foundRoles.flatMap((role) => role.permissions);

  if (
    userPermissions.includes(permission) ||
    userAcces.permissions.includes(permission)
  ) {
    next();
  } else {
    next(new HttpException(401, "no permission"));
  }
}
export default companyMiddleware;
