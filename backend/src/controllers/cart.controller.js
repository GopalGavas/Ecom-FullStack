// controllers/cart.controller.js
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

async function getPopulatedCart(userId) {
  return await Cart.findOne({ user: userId }).populate("items.product");
}

export const addToCartController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findOne({ _id: productId, isDeleted: false });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }],
      });
      const popped = await getPopulatedCart(userId);
      return res
        .status(201)
        .json({ success: true, message: "Added to cart", cart: popped });
    }

    // itemIndex compare on raw ObjectId (cart not populated here)
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const popped = await getPopulatedCart(userId);

    return res
      .status(200)
      .json({ success: true, message: "Product added to cart", cart: popped });
  } catch (error) {
    console.error("Add To Cart Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getCartController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await getPopulatedCart(userId);
    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Get Cart Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * updateCartQuantityController:
 * - Accepts either { productId, quantity } OR { productId, action: 'increase'|'decrease' }
 * - Returns the updated populated cart.
 */
export const updateCartQuantityController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;
    let { quantity, action } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    // find item by populated product._id
    const item = cart.items.find((it) => {
      // handle populated or not (defensive)
      const id =
        it.product && it.product._id
          ? it.product._id.toString()
          : it.product.toString();
      return id === productId;
    });

    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Product not in cart" });

    // If frontend gave an action instead of a quantity, compute new quantity
    if (typeof quantity === "undefined" && action) {
      if (action === "increase") quantity = item.quantity + 1;
      else if (action === "decrease") quantity = item.quantity - 1;
    }

    // Validate quantity
    if (
      typeof quantity === "undefined" ||
      isNaN(quantity) ||
      Number(quantity) < 1
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Quantity must be a positive number",
        });
    }

    item.quantity = Number(quantity);
    await cart.save();

    const popped = await getPopulatedCart(userId);
    return res
      .status(200)
      .json({ success: true, message: "Quantity updated", cart: popped });
  } catch (error) {
    console.error("Update Quantity Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const removeFromCartController = async (req, res) => {
  try {
    const userId = req.user.userId;

    // support both DELETE /remove/:productId and PUT/POST /remove with body
    const productId = req.params.productId || req.body.productId;
    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "productId is required" });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    // filter using populated _id robustly
    cart.items = cart.items.filter((item) => {
      const id =
        item.product && item.product._id
          ? item.product._id.toString()
          : item.product.toString();
      return id !== productId;
    });

    await cart.save();
    const popped = await getPopulatedCart(userId);

    return res
      .status(200)
      .json({
        success: true,
        message: "Product removed from cart",
        cart: popped,
      });
  } catch (error) {
    console.error("Remove From Cart Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const clearCartController = async (req, res) => {
  try {
    const userId = req.user.userId;
    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
    const popped = await getPopulatedCart(userId);
    return res
      .status(200)
      .json({ success: true, message: "Cart cleared", cart: popped });
  } catch (error) {
    console.error("Clear Cart Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
