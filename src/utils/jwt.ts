import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";

dotenv.config();

export const sign = async (payload) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
  } catch (error) {
    throw error;
  }
};

export const verify = async (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (error) {
    throw error;
  }
};
