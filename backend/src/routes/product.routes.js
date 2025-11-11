import { Router } from "express";
import { createProductController } from "../controllers/product.controller.js";
import { verifyJWT, verifySeller } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT, verifySeller);

router.post("/", createProductController);

export default router;
