import { Request, Response, NextFunction } from "express";
import HttpException from "@utils/exceptions/http.exception";
import userModel from "@resources/user/user.model";
import roles from "../config/roles.json";
async function rbacMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
  permission: string
): Promise<Error | void> {
  if (!req.headers.authorization) {
  }
  const token = req.headers.authorization?.split("Bearer ")[1].trim() as string;

  const user = await userModel.findOne({ token: token });
  if (user) {
    const userRole = user.role;
    const foundRole = roles.roles.find((role) => role.name === userRole);
    if (foundRole === undefined) {
      return next(new HttpException(401, "role not found"));
    }

    const userPermissions = foundRole.permissions;

    if (!userPermissions.includes(permission)) {
      return next(new HttpException(401, "no permission"));
    }
    next();
  }
}
export default rbacMiddleware;
