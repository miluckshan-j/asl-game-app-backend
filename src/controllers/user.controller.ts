import { Response, Request } from "express";

export const health = (req: Request, res: Response): void => {
  res.status(200).json({
    code: 200,
    message: "running",
  });
};
