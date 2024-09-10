import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // frontend origin
    methods: ["GET", "POST"],
  },
});
initSocket(io);
import { swaggerUi, specs } from "./swagger.js";
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
import stockRouter from "./routes/stock.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import { initSocket } from "./socket/socketManager.js";

app.use("/api/auth", userRouter);

app.use("/api/user", userRouter);

app.use("/api/posts", stockRouter);

app.use("/api/posts", commentRouter);

app.use("/api/posts", likeRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api", errorHandler);
// default route for undefined routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

export { server,app };
