import { Request } from "express";
import * as userRepository from "../repository/user.repository";
import { ResponseCodes } from "../utils/responseCodes";
import { HttpStatusCodes } from "../utils/httpStatusCodes";

export const register = async (req: Request) => {
  const { username, email, password } = req.body;
  const document = {
    username,
    email,
    password,
  };
  try {
    const dbResponse = await userRepository.insert(document);
    if (dbResponse.code === ResponseCodes.CREATED) {
      return {
        statusCode: HttpStatusCodes.CREATED,
        code: dbResponse.code,
        message: dbResponse.message,
        data: dbResponse.data,
      };
    }
    throw Error("Unexpected database response");
  } catch (error) {
    throw error;
  }
};
