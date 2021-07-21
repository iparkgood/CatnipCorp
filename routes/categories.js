const express = require("express");
const { client } = require("../db");
const categoriesRouter = express.Router();
const { requireAdmin } = require("./utils");
const {
  getAllCategories,
  createCategory,
  deleteCategory,
  createCategoryProduct,
  deleteCategoryProduct
} = require("../db/categories");

// get all categories
categoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.send(categories);
  } catch (error) {
    console.error("GET /categories error");
    next(error);
  }
});

// create a new category
categoriesRouter.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = await createCategory(name);
    res.send(category);
  } catch (error) {
    console.error("POST /categories error");
    next(error);
  }
});

// delete a category
// will only work if category is deleted from all products first
categoriesRouter.delete("/:categoryId", async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await deleteCategory(categoryId);
    res.send(category);
  } catch (error) {
    console.error("DELETE /categories/:categoryId error");
    next(error);
  }
})

// add a new category to a product
categoriesRouter.post('/:productId/:categoryId', async (req, res, next) => {
  try {
    const { productId, categoryId } = req.params;
    const categoryProduct = await createCategoryProduct({productId, categoryId});
    res.send(categoryProduct);
  } catch (error) {
    console.error("POST /categories/:productID/:categoryId error");
    next(error);
  }
})

// delete category from a product
categoriesRouter.delete('/:productId/:categoryId', async (req, res, next) => {
  try {
    const { productId, categoryId } = req.params;
    console.log("product", productId);
    console.log("category", categoryId);
    const categoryProduct = await deleteCategoryProduct({productId, categoryId});
    res.send(categoryProduct);
  } catch (error) {
    console.error("DELETE /categories/:productID/:categoryId error");
    next(error);
  }
})

module.exports = categoriesRouter;
