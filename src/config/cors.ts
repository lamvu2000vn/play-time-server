import {CorsOptions} from "cors";
import {getCorsWhitelist} from "../helpers/utils/utils";

export const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (getCorsWhitelist().indexOf(origin!) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
