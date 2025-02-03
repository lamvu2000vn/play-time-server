import express from "express";
import {findById, getAll, getAllItems} from "../../controllers/API/itemTypeController";

const router = express.Router();

router.get("/get-all", getAll);
router.get("/:id", findById);
router.get("/:id/item/get-all", getAllItems);

export default router;
