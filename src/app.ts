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

(async () => {
    const app = express();
    const port = process.env.HTTP_PORT || 3000;
    const httpServer = createServer(app);

    await connectDB();

    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use("/assets", express.static(path.join(__dirname, "public/assets")));
    app.use(cors(corsOptions));

    initializeSocket(httpServer);

    app.use("/api", apiRoutes);

    httpServer.listen(port, () => {
        console.log(`Server is running on port:${port}`);
    });
})();
