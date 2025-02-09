import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import apiRoutes from "./routes/api";
import connectDB from "./database/database";
import {createServer} from "http";
import initializeSocket from "./socket/initializeSocket";
import cors from "cors";
import {corsOptions} from "./config/cors";
import cookieSession from "cookie-session";

(async () => {
    const app = express();
    const port = process.env.HTTP_PORT || 3000;
    const httpServer = createServer(app);

    await connectDB();

    app.set("trust proxy", 1);
    app.use(
        cookieSession({
            name: "session",
            keys: ["key1"],
            secure: true,
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : undefined,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        })
    );
    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use("/assets", express.static(path.join(__dirname, "public/assets")));
    app.use(cors(corsOptions));

    initializeSocket(httpServer);

    app.use("/api", apiRoutes);
    app.use("/", (_, res) => {
        res.send("Hello, world!");
    });

    httpServer.listen(port, () => {
        console.log(`Server is running on port:${port}`);
    });
})();
