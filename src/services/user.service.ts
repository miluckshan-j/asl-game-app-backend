import { Request } from "express";
import * as bcrypt from "bcrypt";

import * as userRepository from "../repository/user.repository";
import { ResponseCodes } from "../utils/responseCodes";
import { HttpStatusCodes } from "../utils/httpStatusCodes";
import * as jwt from "../utils/jwt";
import * as mongoDb from "../utils/mongoDb";
import * as badges from "../utils/badges";

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
  const { user, username } = req.body;
  const filter = {
    _id: mongoDb.castToObjectId(user._id),
  };
  const update = {
    $set: {
      username,
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
  const { user } = req.body;
  const filter = {
    _id: mongoDb.castToObjectId(user._id),
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
  const { user, id, name, results } = req.body;
  const filter = {
    _id: mongoDb.castToObjectId(user._id),
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
        date: Date.now(),
      },
    },
  };
  try {
    const dbResponse = await userRepository.update(filter, update);
    if (dbResponse.code === ResponseCodes.UPDATED) {
      const badge = await addBadge(user._id, id, name);
      if (badge.isSuccess) {
        return {
          statusCode: HttpStatusCodes.OK,
          code: ResponseCodes.OK,
          message: badge.achievment,
          data: dbResponse.data,
        };
      }
      return {
        statusCode: HttpStatusCodes.OK,
        code: ResponseCodes.UPDATED,
        message: dbResponse.message,
        data: dbResponse.data,
      };
    }
    if (
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

// Private Functions

const addBadge = async (userId, gameId, gameName) => {
  const filter = {
    _id: mongoDb.castToObjectId(userId),
  };
  try {
    let dbResponse = await userRepository.countEntriesOfGameOfUser(
      filter,
      gameId
    );
    if (
      dbResponse.code === ResponseCodes.OK ||
      dbResponse.code === ResponseCodes.NOT_FOUND
    ) {
      const dbResponseData = Array.isArray(dbResponse.data)
        ? dbResponse.data[0]
        : dbResponse.data;
      if (badges.badgeCount.includes(dbResponseData.count)) {
        const message = badges.generateMessage(dbResponseData.count, gameName);
        const update = {
          $addToSet: {
            badges: {
              achievement: message,
              gameId,
              gameName,
            },
          },
        };
        try {
          dbResponse = await userRepository.update(filter, update);
          if (dbResponse.code === ResponseCodes.UPDATED) {
            return {
              isSuccess: true,
              isNewBadge: true,
              achievment: message,
            };
          }
          if (dbResponse.code === ResponseCodes.NOT_MODIFIED) {
            return {
              isSuccess: true,
              isNewBadge: false,
              achievment: "Badge already exists",
            };
          }
          throw Error("Error in adding badge");
        } catch (error) {
          throw error;
        }
      }
      throw Error("No Badge required");
    }
  } catch (error) {
    console.log(error);
    return {
      isSuccess: false,
    };
  }
};
