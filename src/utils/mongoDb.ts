import * as dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

export const client = new MongoClient(process.env.DB_CONN_STRING);

export const createConn = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection failed.", error);
  }
};

export function castToObjectId(id: string) {
  return new ObjectId(id);
}

module.exports = { client, createConn, castToObjectId };
