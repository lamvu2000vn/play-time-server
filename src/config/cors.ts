import {CorsOptions} from "cors";

const corsWhitelist = ["http://localhost:3000"];

export const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (corsWhitelist.indexOf(origin!) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
