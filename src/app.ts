import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import apiRoutes from "./routes/api";
import connectDB from "./database/database";
import {createServer} from "http";
import initializeSocket from "./socket/initializeSocket";
import cors from "cors";
import "dotenv/config";
import {corsOptions} from "./config/cors";

(async () => {
    const app = express();
    const port = 3001;
    const httpServer = createServer(app);

    await connectDB();

    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));
    app.use(cors(corsOptions));

    initializeSocket(httpServer);

    app.use("/api", apiRoutes);

    httpServer.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
})();
