import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  getCurrentUserController,
  logoutUserController,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/", verifyJWT, getCurrentUserController);
router.post("/logout", verifyJWT, logoutUserController);

export default router;
