import { Router } from "express";
import { checkoutController } from "../controllers/checkout.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/checkout", verifyJWT, checkoutController);

export default router;
