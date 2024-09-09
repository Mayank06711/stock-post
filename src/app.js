import express from "express";
import cors from "cors"; 
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.COR_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" })); 

app.use(express.urlencoded({ extended: true, limit: "20kb" })); 

app.use(cookieParser()); //perform CRUD OPER ON USER WEB COOKIES

// // importing routes
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middleware/verify.middleware.js";
// import stockRouter from "./routes/stock.routes.js";
// import commentRouter from "./routes/comment.routes.js";
// import likeRouter from "./routes/like.routes.js";


app.use("/api/auth", userRouter);

app.use("/api/user", userRouter); 

// app.use("/api/post", videoRouter);

// app.use("/api/post", commentRouter);

// app.use("/api/likes", likeRouter);

app.use("/api", errorHandler)
// default route for undefined routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

export { app };
