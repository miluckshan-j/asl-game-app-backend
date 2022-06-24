import * as dotenv from "dotenv";
import * as mongoDb from "../utils/mongoDb";
import { ResponseCodes } from "../utils/responseCodes";

dotenv.config();

export const insert = async (document) => {
  try {
    const collection = mongoDb.client
      .db(process.env.DB_NAME)
      .collection(process.env.USERS_COLLECTION_NAME);
    await collection.insertOne(document);
    return {
      code: ResponseCodes.CREATED,
      message: "Document added",
      data: null,
    };
  } catch (error) {
    throw error;
  }
};

export const find = async (filter, option?) => {
  try {
    const collection = mongoDb.client
      .db(process.env.DB_NAME)
      .collection(process.env.USERS_COLLECTION_NAME);
    const response = await collection.find(filter, option).toArray();
    if (response.length > 0) {
      return {
        code: ResponseCodes.OK,
        message: "Results found",
        data: response,
      };
    }
    return {
      code: ResponseCodes.NOT_FOUND,
      message: "No results found",
      data: null,
    };
  } catch (error) {
    throw error;
  }
};

export const update = async (filter, update) => {
  try {
    const collection = mongoDb.client
      .db(process.env.DB_NAME)
      .collection(process.env.USERS_COLLECTION_NAME);
    const response = await collection.updateOne(filter, update);
    if (response.matchedCount === 1 && response.modifiedCount === 1) {
      return {
        code: ResponseCodes.UPDATED,
        message: "Updated",
        data: null,
      };
    }
    if (response.matchedCount === 1 && response.modifiedCount === 0) {
      return {
        code: ResponseCodes.NOT_MODIFIED,
        message: "Nothing to modify",
        data: null,
      };
    }
    if (response.matchedCount === 0) {
      return {
        code: ResponseCodes.NOT_FOUND,
        message: "Not found",
        data: null,
      };
    }
    return {
      code: ResponseCodes.FAILED,
      message: "Failed",
      data: null,
    };
  } catch (error) {
    throw error;
  }
};

// Custom Functions

export const countEntriesOfGameOfUser = async (
  match: object,
  gameId: number
) => {
  try {
    const collection = mongoDb.client
      .db(process.env.DB_NAME)
      .collection(process.env.USERS_COLLECTION_NAME);
    const response = await collection
      .aggregate([
        {
          $match: {
            ...match,
          },
        },
        {
          $project: {
            count: {
              $cond: {
                if: { $isArray: "$results" },
                then: {
                  $size: {
                    $filter: {
                      input: "$results",
                      as: "result",
                      cond: { $eq: ["$$result.id", gameId] },
                    },
                  },
                },
                else: 0,
              },
            },
          },
        },
      ])
      .toArray();
    if (response) {
      return {
        code: ResponseCodes.OK,
        message: "Retrieved count",
        data: response,
      };
    }
    return {
      code: ResponseCodes.NOT_FOUND,
      message: "No matching record count",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};
