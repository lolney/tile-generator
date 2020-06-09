import { Request, Response, NextFunction } from "express";
import { TokenService } from "../services";

export const gcpTokenMiddleware = (tokenService: TokenService) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = await tokenService.getToken();
  req.headers.authorization = `Bearer ${token}`;
  next();
};
