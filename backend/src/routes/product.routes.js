import { Router } from "express";
import { viewAllProductsController } from "../controllers/product.controller.js";

const router = Router();

router.get("/", viewAllProductsController);

export default router;
