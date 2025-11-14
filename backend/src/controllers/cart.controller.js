import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

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
      return res
        .status(201)
        .json({ success: true, message: "Added to cart", cart });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    return res
      .status(200)
      .json({ success: true, message: "Product added to cart", cart });
  } catch (error) {
    console.error("Add To Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCartController = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Get Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateCartQuantityController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    if (quantity < 1)
      return res
        .status(400)
        .json({ success: false, message: "Quantity must be at least 1" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Product not in cart" });

    item.quantity = quantity;

    await cart.save();

    return res.status(200).json({ success: true, message: "Quantity updated" });
  } catch (error) {
    console.error("Update Quantity Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removeFromCartController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    return res
      .status(200)
      .json({ success: true, message: "Product removed from cart" });
  } catch (error) {
    console.error("Remove From Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const clearCartController = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

    return res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    console.error("Clear Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
