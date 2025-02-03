import express from "express";
import {getGameStatistic, getPaidItems, getUserById, getHistory} from "../../controllers/API/userController";
import {isAuthenticated} from "../../middlewares";

const router = express.Router();
router.get("/:id", getUserById);
router.get("/:id/paid-items", isAuthenticated, getPaidItems);
router.get("/:userId/game/:gameId?/statistics", isAuthenticated, getGameStatistic);
router.get("/:userId/game/:gameId/history", isAuthenticated, getHistory);

export default router;
