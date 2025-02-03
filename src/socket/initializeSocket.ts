import {Server as HttpServer} from "http";
import {Server} from "socket.io";
import SocketHandler from "./SocketHandler";
import MatchTimeHandler from "./MatchTimeHandler";
import {getCorsWhitelist} from "../helpers/utils/utils";

export default function (httpServer: HttpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: getCorsWhitelist(),
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    const matchTimerHandle = MatchTimeHandler.getInstance(io);

    io.on("connection", (socket) => {
        console.log("user connected: ", socket.id);

        new SocketHandler(io, socket, matchTimerHandle);
    });
}
