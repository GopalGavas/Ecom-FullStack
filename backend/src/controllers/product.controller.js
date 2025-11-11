import { Product } from "../models/product.model.js";

export const createProductController = async (req, res) => {
  try {
    const { title, brandName, quantity, category, imageUrl } = req.body;

    if (!title || !brandName || !category) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const product = await Product.create({
      title,
      brandName,
      quantity,
      category,
      imageUrl: imageUrl || "",
      seller: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const viewAllProductsController = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email");
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get All Products Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const viewSingleProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("seller", "name email");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Get Single Product Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const viewSellerProductsController = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.userId });
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Get Seller Products Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, brandName, quantity, category, imageUrl } = req.body;

    const updates = { title, brandName, quantity, category, imageUrl };

    const product = await Product.findOneAndUpdate(
      { _id: id, seller: req.user.userId, isDeleted: false },
      updates,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const softDeletedProduct = await Product.findOneAndUpdate(
      { _id: id, seller: req.user.userId },
      { isDeleted: true },
      { new: true }
    );

    if (!softDeletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found or unauthorized" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
