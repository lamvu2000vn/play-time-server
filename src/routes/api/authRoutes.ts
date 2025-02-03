import express from "express";
import {getUser, login, logout, register, refreshToken} from "../../controllers/API/authController";
import {loginValidate, logoutValidate, refreshTokenValidate, userRegistrationValidate} from "../requestValidation";
import {isAuthenticated} from "../../middlewares";

const router = express.Router();

router.post("/register", userRegistrationValidate, register);
router.post("/login", loginValidate, login);
router.post("/token", refreshTokenValidate, refreshToken);
router.post("/logout", logoutValidate, logout);
router.get("/user", isAuthenticated, getUser);

export default router;
