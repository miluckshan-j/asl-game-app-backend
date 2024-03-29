import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import * as bodyParser from "body-parser";

import * as mongoDb from "./utils/mongoDb";
import * as userController from "./controllers/user.controller";
import { authenticateToken } from "./middlewares/jwt";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const app = express();
const port: number = parseInt(process.env.PORT as string, 10);

// middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get("/health", userController.health);
app.post("/register", userController.register);
app.post("/login", userController.login);
app.get("/users/me", authenticateToken, userController.retrieveProfile);
app.put("/users/me", authenticateToken, userController.updateProfile);
app.delete("/users/me", authenticateToken, userController.deleteProfile);
app.post("/users/me/results", authenticateToken, userController.addGameResult);

app.listen(port, () => {
  console.log(`Application is running on port ${port}.`);
});

mongoDb.createConn();
