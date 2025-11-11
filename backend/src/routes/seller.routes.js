import Router from "express";
import {
  deleteProductController,
  updateProductController,
  viewSellerProductsController,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/products", viewSellerProductsController);
router.put("/products/:id", updateProductController);
router.put("/products/:id", deleteProductController);

export default router;
