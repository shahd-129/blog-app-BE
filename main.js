import express from "express";
import cors from "cors";
import "./DB/connection.js";
import userRouter from "./src/Modules/user/user.route.js";
import { AppError } from "./src/utils/ErrorHandling.js";
import postRouter from "./src/Modules/post/post.route.js";
const app = express();
const port = 3000;
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use("/user", userRouter);
app.use("/post", postRouter);

app.use("*", (req, res, next) => {
  next(new AppError(req.originalUrl + "not found", 404));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
