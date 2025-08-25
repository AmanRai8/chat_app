import express from "express";
import { ENV } from "./config/env.js";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World3");
});

app.listen(ENV.PORT, () => {
  console.log("server started on port:", ENV.PORT);
});
