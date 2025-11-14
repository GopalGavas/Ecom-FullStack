import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addToCartController,
  clearCartController,
  getCartController,
  removeFromCartController,
  updateCartQuantityController,
} from "../controllers/cart.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/add", addToCartController);
router.get("/", getCartController);
router.put("/update", updateCartQuantityController);
router.delete("/remove/:productId", removeFromCartController);
router.delete("/clear", clearCartController);

export default router;
