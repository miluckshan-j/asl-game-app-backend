import { Request } from "express";
import * as bcrypt from "bcrypt";
import * as userRepository from "../repository/user.repository";
import { ResponseCodes } from "../utils/responseCodes";
import { HttpStatusCodes } from "../utils/httpStatusCodes";
import * as jwt from "../utils/jwt";
import * as mongoDb from "../utils/mongoDb";

export const register = async (req: Request) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const document = {
    username,
    email,
    password: hashedPassword,
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
  };
  try {
    const dbResponse = await userRepository.find(filter);
    if (dbResponse.code === ResponseCodes.OK) {
      const payload = Array.isArray(dbResponse.data)
        ? dbResponse.data[0]
        : dbResponse.data;
      const passwordValidity = await bcrypt.compare(password, payload.password);
      if (passwordValidity) {
        delete payload.password;
        const token = await jwt.sign(payload);
        return {
          statusCode: HttpStatusCodes.OK,
          code: dbResponse.code,
          message: dbResponse.message,
          data: { ...payload, token: token },
        };
      }
      return {
        statusCode: HttpStatusCodes.OK,
        code: dbResponse.code,
        message: "Incorrect password",
        data: [],
      };
    }
    if (dbResponse.code === ResponseCodes.NOT_FOUND) {
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

export const deleteProfile = async (req: Request) => {
  const { password } = req.body;
  const { uid } = req.params;
  const filter = {
    _id: mongoDb.castToObjectId(uid),
    password,
  };
  const update = {
    $set: {
      status: 1,
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

export const addGameResult = async (req: Request) => {
  const { id, name, results } = req.body;
  const { uid } = req.params;
  const filter = {
    _id: mongoDb.castToObjectId(uid),
  };
  const update = {
    $addToSet: {
      gamesPlayed: {
        id,
        name,
      },
      results: {
        id,
        name,
        results,
      },
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
