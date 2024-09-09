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
// import userRouter from "./routes/user.routes.js";
// import stockRouter from "./routes/stock.routes.js";
// import commentRouter from "./routes/comment.routes.js";
// import likeRouter from "./routes/like.routes.js";

// // Mounting the userRouter middleware at the "/api/v1/users" endpoint

// app.use("/api/auth", authRouter);

// app.use("/api/user", userRouter); 

// app.use("/api/post", videoRouter);

// app.use("/api/post", commentRouter);

// app.use("/api/likes", likeRouter);

// default route for undefined routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} not found.`,
  });
});

// http://localhost/api/v1/users/*
export { app };
