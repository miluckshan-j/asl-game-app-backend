import * as dotenv from "dotenv";
import express from "express";
import * as bodyParser from "body-parser";

import * as mongoDb from "./utils/mongoDb";
import * as userController from "./controllers/user.controller";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const app = express();
const port: number = parseInt(process.env.PORT as string, 10);

// middlewares
app.use(bodyParser.json());

// Routes
app.get("/health", userController.health);
app.post("/register", userController.register);
app.post("/login", userController.login);
app.put("/users/:uid", userController.updateProfile);
app.delete("/users/:uid", userController.deleteProfile);
app.post("/users/:uid/results", userController.addGameResult);

app.listen(port, () => {
  console.log(`Application is running on port ${port}.`);
});

mongoDb.createConn();
