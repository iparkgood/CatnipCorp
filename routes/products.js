const express = require("express");
const productsRouter = express.Router();
const { requireUser, requireAdmin } = require("./utils");

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} = require("../db/products");
const {
  deleteCategoryProduct,
  updateCategoryProduct,
  getCategoryById,
} = require("../db/categories");
const { deleteProductReviews } = require("../db/reviews");

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (error) {
    console.error("GET /products error");
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await getProductById(productId);
    if (!product)
      res.send({
        error: "Missing Product Error",
        message: "No product found with that ID",
      });
    res.send(product);
  } catch (error) {
    console.error("GET /products/:productId error");
    next(error);
  }
});

productsRouter.get("/category/:categoryName", async (req, res, next) => {
  try {
    const { categoryName } = req.params;
    const products = await getProductsByCategory(categoryName);
    res.send(products);
  } catch (error) {
    console.error("GET /products/:category error");
    next(error);
  }
});

productsRouter.post("/", requireAdmin, async (req, res, next) => {
  console.log("req body", req.body);
  try {
    const { name, description, price, quantity, categoryId } = req.body;
    let imageName = req.body.imageName ? imageName : "cat.jpeg";
    const product = await createProduct({
      name,
      description,
      price,
      quantity,
      imageName,
      categoryId,
    });
    const category = await getCategoryById(categoryId);
    product.category = category.name;
    product.categoryId = categoryId;
    
    res.send(product);
  } catch (error) {
    console.error("GET /products/:productId error");
    next(error);
  }
});

productsRouter.patch("/:productId", requireAdmin, async (req, res, next) => {
  const { productId } = req.params;
  const { name, description, price, quantity, categoryId } = req.body;
  const fields = {};
  if (name) fields.name = name;
  if (description) fields.description = description;
  if (price) fields.price = price;
  if (quantity !== undefined) fields.quantity = quantity;
  try {
    const updatedProduct = await updateProduct(productId, fields);
    if (categoryId) {
      const updatedCategory = await updateCategoryProduct({
        productId,
        categoryId,
      });
      const { name } = await getCategoryById(updatedCategory.categoryId);
      updatedProduct.category = name;
      updatedProduct.categoryId = categoryId;
    }
    res.send(updatedProduct);
  } catch (error) {
    next(error);
  }
});

productsRouter.patch("/:productId/quantity", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const updatedQuantity = await updateProduct(productId, { quantity });

    res.send(updatedQuantity);
  } catch (error) {
    console.error("PATCH /products/:productId/quantity error");
    next(error);
  }
});

productsRouter.delete("/:productId", requireAdmin, async (req, res, next) => {
  try {
    const { productId } = req.params;
    await deleteCategoryProduct(productId);
    await deleteProductReviews(productId);
    const product = await deleteProduct(productId);
    if (!product)
      res.send({
        error: "Missing Product Error",
        message: "No product found with that ID",
      });
    res.send(product);
  } catch (error) {
    console.error("DELETE /products/:productId error");
    next(error);
  }
});

module.exports = productsRouter;
