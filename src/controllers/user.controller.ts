import { Response, Request } from "express";

import * as userService from "../services/user.service";
import { HttpStatusCodes } from "../utils/httpStatusCodes";
import { ResponseCodes } from "../utils/responseCodes";

export const health = (req: Request, res: Response): void => {
  res.status(200).json({
    code: 200,
    message: "running",
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const response = await userService.register(req);
    res.status(response.statusCode).json({
      code: response.code,
      message: response.message,
      data: response.data || [],
    });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      code: ResponseCodes.FAILED,
      message: "Something went wrong!",
      data: [],
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const response = await userService.login(req);
    res.status(response.statusCode).json({
      code: response.code,
      message: response.message,
      data: response.data || [],
    });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      code: ResponseCodes.FAILED,
      message: "Something went wrong!",
      data: [],
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const response = await userService.updateProfile(req);
    res.status(response.statusCode).json({
      code: response.code,
      message: response.message,
      data: response.data || [],
    });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      code: ResponseCodes.FAILED,
      message: "Something went wrong!",
      data: [],
    });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const response = await userService.deleteProfile(req);
    res.status(response.statusCode).json({
      code: response.code,
      message: response.message,
      data: response.data || [],
    });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      code: ResponseCodes.FAILED,
      message: "Something went wrong!",
      data: [],
    });
  }
};

export const addGameResult = async (req: Request, res: Response) => {
  try {
    const response = await userService.addGameResult(req);
    res.status(response.statusCode).json({
      code: response.code,
      message: response.message,
      data: response.data || [],
    });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      code: ResponseCodes.FAILED,
      message: "Something went wrong!",
      data: [],
    });
  }
};
