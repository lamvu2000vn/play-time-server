import express, {Request, Response} from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import gameRoutes from "./gameRoutes";
import itemTypesRoutes from "./itemTypeRoutes";
import friendRoutes from "./friendRoutes";
import historyRoutes from "./historyRoutes";
import itemRoutes from "./itemRoutes";
import paidItemRoutes from "./paidItemRoutes";
import {isAuthenticated} from "../../middlewares";
import mongoose from "mongoose";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", isAuthenticated, userRoutes);
router.use("/game", isAuthenticated, gameRoutes);
router.use("/item-type", isAuthenticated, itemTypesRoutes);
router.use("/friend", isAuthenticated, friendRoutes);
router.use("/history", isAuthenticated, historyRoutes);
router.use("/item", isAuthenticated, itemRoutes);
router.use("/paid-item", isAuthenticated, paidItemRoutes);
router.get("/drop-collection/:name", async (req: Request, res: Response) => {
    const name = req.params.name;

    const result = await mongoose.connection.dropCollection(name);

    res.json(result);
});

router.get("/truncate-collection/:name", async (req: Request, res: Response) => {
    try {
        const collectionName = req.params.name;
        // Kiểm tra xem collection có tồn tại không
        const collections = await mongoose.connection.db?.listCollections().toArray();
        const collectionExists = collections?.some((col) => col.name === collectionName);

        if (!collectionExists) {
            console.log(`Collection "${collectionName}" không tồn tại.`);
            return;
        }

        // Truy cập và xóa toàn bộ dữ liệu trong collection
        await mongoose.connection.collection(collectionName).deleteMany({});
        res.send(`Đã xóa toàn bộ dữ liệu trong collection "${collectionName}".`);
    } catch (error) {
        res.send(`Lỗi khi xóa collection: ${error instanceof Error ? error.message : ""}`);
    }
});

export default router;
