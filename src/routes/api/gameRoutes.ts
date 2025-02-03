import express from "express";
import {getAllGameInfo, getGameInfo, getGameRanking} from "../../controllers/API/gameController";
import {isAuthenticated} from "../../middlewares";

const router = express.Router();

router.get("/get-all", isAuthenticated, getAllGameInfo);
router.get("/get-info", isAuthenticated, getGameInfo);
router.get("/:id", isAuthenticated, getGameInfo);
router.get("/:id/ranking", isAuthenticated, getGameRanking);

export default router;
