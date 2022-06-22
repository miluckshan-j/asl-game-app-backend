import * as dotenv from "dotenv";
import express from "express";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const app = express();
const port: number = parseInt(process.env.PORT as string, 10);

app.listen(port, () => {
  console.log(`Application is running on port ${port}.`);
});
