import * as dotenv from "dotenv";
import express from "express";

import * as mongoDb from "./utils/mongoDb";
import * as userController from "./controllers/user.controller";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const app = express();
const port: number = parseInt(process.env.PORT as string, 10);

// Routes
app.get("/health", userController.health);

app.listen(port, () => {
  console.log(`Application is running on port ${port}.`);
});

mongoDb.createConn();
