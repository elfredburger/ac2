import { Request, Response, NextFunction } from "express";
import token from "../utils/token";
import userModel from "../resources/user/user.model";
import Token from "../utils/interfaces/token.interface";
import HttpException from "../utils/exceptions/http.exception";
import jwt from "jsonwebtoken";

async function authenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | Error | void> {
  const bearer = req.headers.authorization as string;
  try {
    if (!bearer || !bearer.startsWith("Bearer ")) {
      return next(new HttpException(401, "Unauthorized"));
    }
    const accessToken = bearer.split("Bearer ")[1].trim();

    const payload: Token | jwt.JsonWebTokenError = await token.verifyToken(
      accessToken
    );
    if (payload instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, "Unauthorized"));
    }
    const user = await userModel
      .findOne({ token: accessToken })
      .select("-password")
      .exec();
    if (!user) {
      return next(new HttpException(401, "Unauthorized"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
export default authenticatedMiddleware;
