const { createCategoryProduct, createCategory } = require("./categories");

const createInitialCategoryProducts = async () => {
  console.log("Starting to create category_products...");
  try {
    const catProdToCreate = [
      {
        productId: 1,
        categoryId: 1,
      },
      {
        productId: 2,
        categoryId: 1,
      },
      {
        productId: 3,
        categoryId: 2,
      },
      {
        productId: 4,
        categoryId: 3,
      },
    ];
    const category_products = await Promise.all(
      catProdToCreate.map(createCategoryProduct)
    );
    console.log("Category Products");
    console.log(category_products);
    return category_products;
  } catch (error) {
    console.error("Create Initial Category Product failed", error);
  }
};

const createInitialCategories = async () => {
  console.log("Starting to create categories...");
  try {
    const catToCreate = [
      {
        name: "Food",
      },
      {
        name: "Toys",
      },
      {
        name: "Health",
      },
      {
        name: "Accessories",
      },
    ];
    const categories = await Promise.all(catToCreate.map(createCategory));
    console.log("Categories");
    console.log(categories);
  } catch (error) {
    console.error("Create Initial Category failed", error);
  }
};

module.exports = {
  createInitialCategoryProducts,
  createInitialCategories,
};
