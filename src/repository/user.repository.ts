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
