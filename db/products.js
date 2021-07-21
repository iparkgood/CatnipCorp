const client = require("./client");

const { createCategoryProduct } = require("./categories");

const getAllProducts = async () => {
  try {
    const {
      rows: products,
    } = await client.query(`SELECT p.*, c.name AS category, c.id AS "categoryId"
    FROM products p
    LEFT JOIN category_products cp ON p.id = cp."productId"
    LEFT JOIN categories c ON c.id = cp."categoryId";`);
    return products;
  } catch (error) {
    console.log("Error getting products");
    console.error(error);
  }
};

// inlcudes array of reviews
const getProductById = async (id) => {
  try {
    const {
      rows: [product],
    } = await client.query(/*sql*/ `SELECT * FROM products WHERE id=$1;`, [id]);
    const reviews = await getProductReviews(id);
    if (!product) return;
    if (reviews) {
      product.reviews = [];
      reviews.map((review) => product.reviews.push(review));
    }
    return product;
  } catch (error) {
    console.log("Error getting products");
    console.error(error);
  }
};

const getProductsByCategory = async (category) => {
  category = category.toLowerCase();
  try {
    const { rows: products } = await client.query(
      `
      SELECT p.*, c.name AS category
      FROM products p
      JOIN category_products cp ON p.id = cp."productId"
      JOIN categories c ON c.id = cp."categoryId"
      WHERE c.name=$1
    `,
      [category]
    );
    return products;
  } catch (error) {
    console.log("Error getting products");
    console.error(error);
  }
};

// there will be a drop down menu to select a category when creating a new product
// the category id will be sent in with request to createProduct
const createProduct = async ({
  name,
  description,
  price,
  quantity,
  imageName,
  categoryId,
}) => {
  try {
    const {
      rows: [product],
    } = await client.query(
      /*sql*/
      `
    INSERT INTO products(name, description, price, quantity, "imageName") VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
      [name, description, price, quantity, imageName]
    );

    const category = await createCategoryProduct({
      productId: product.id,
      categoryId,
    });
    return product;
  } catch (error) {
    console.log("Error creating product");
    console.error(error);
  }
};

// updateProduct

const updateProduct = async (productId, fields = {}) => {
  const updatingFields = Object.keys(fields).map((key, index) => {
    return `"${key}"=$${index+1}`
  }).join(", ");
  try {
    if (updatingFields.length > 0) {
      const {rows: updatedProduct} = await client.query(
        `
        UPDATE products
        SET ${updatingFields}
        WHERE id=${productId}
        RETURNING *;
        `,
        Object.values(fields)
      );
      
      return updatedProduct[0];
    }
  } catch (error) {
    console.log("updateProduct", error);
  }
};

const deleteProduct = async (id) => {
  try {
    const {
      rows: [product],
    } = await client.query(
      /*sql*/ `
      DELETE FROM products WHERE id=$1 RETURNING *;
    `,
      [id]
    );
    return product;
  } catch (error) {
    console.log("Error deleting product");
    console.error(error);
  }
};

//this will return all reviews for a product with review, rating, and username.
const getProductReviews = async (productId) => {
  try {
    const { rows: reviews } = await client.query(
      /*sql*/
      `SELECT r.id, r.comment, r.rating, users.username
     FROM products AS p
     JOIN reviews as r 
     ON p.id = r."productId"
     JOIN users
     ON r."userId" = users.id
     WHERE p.id=$1;
     `,
      [productId]
    );
    return reviews;
  } catch (error) {
    console.log("Error getting product reviews");
    console.error(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductReviews,
  getProductsByCategory,
};
