import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  updateProductController,
  viewSellerProductsController,
  viewSingleProductController,
} from "../controllers/product.controller.js";
import { verifyJWT, verifySeller } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT, verifySeller);

router.post("/products/add", createProductController);
router.get("/products", viewSellerProductsController);
router.get("/products/:id", viewSingleProductController);
router.put("/products/:id", updateProductController);
router.put("/products/:id/delete", deleteProductController);

export default router;
