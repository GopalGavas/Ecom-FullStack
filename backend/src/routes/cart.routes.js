import { Router } from "express";
import {
  addToCartController,
  getCartController,
  updateCartQuantityController,
  removeFromCartController,
  clearCartController,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/add", verifyJWT, addToCartController);
router.get("/", verifyJWT, getCartController);
router.put("/update", verifyJWT, updateCartQuantityController);
// preferred RESTful remove:
router.delete("/remove/:productId", verifyJWT, removeFromCartController);
// fallback accept body-based remove if needed
router.put("/remove", verifyJWT, removeFromCartController);

router.delete("/clear", verifyJWT, clearCartController);

export default router;
