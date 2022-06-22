import { Request } from "express";
import * as userRepository from "../repository/user.repository";
import { ResponseCodes } from "../utils/responseCodes";
import { HttpStatusCodes } from "../utils/httpStatusCodes";
import * as mongoDb from "../utils/mongoDb";

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

export const login = async (req: Request) => {
  const { email, password } = req.body;
  const filter = {
    email,
    password,
  };
  try {
    const dbResponse = await userRepository.find(filter);
    if (
      dbResponse.code === ResponseCodes.OK ||
      dbResponse.code === ResponseCodes.NOT_FOUND
    ) {
      return {
        statusCode: HttpStatusCodes.OK,
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

export const updateProfile = async (req: Request) => {
  const { password } = req.body;
  const { uid } = req.params;
  const filter = {
    _id: mongoDb.castToObjectId(uid),
  };
  const update = {
    $set: {
      password,
    },
  };
  try {
    const dbResponse = await userRepository.update(filter, update);
    if (
      dbResponse.code === ResponseCodes.UPDATED ||
      dbResponse.code === ResponseCodes.NOT_MODIFIED ||
      dbResponse.code === ResponseCodes.NOT_FOUND ||
      dbResponse.code === ResponseCodes.FAILED
    ) {
      return {
        statusCode: HttpStatusCodes.OK,
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
