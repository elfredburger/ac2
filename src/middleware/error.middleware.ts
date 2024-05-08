import { Request, Response, NextFunction } from "express";
import HttpException from "@utils/exceptions/http.exception";

export default function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = error.status;
  const message = error.message;
}
