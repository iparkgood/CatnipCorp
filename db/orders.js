const client = require("./client");

async function createOrder(userId) {
  try {
    const {
      rows: order,
    } = await client.query(
      /*sql*/ `
        INSERT INTO orders ("userId")
        VALUES($1)
        RETURNING *;
      `,
      [userId]
    );

    return order;
  } catch (error) {
    console.log("Error in createOrder");
    throw error;
  }
}

async function removeOrder(orderId) {
  try {
    const {
      rows: removedCart,
    } = await client.query(
      /*sql*/ `
        UPDATE orders
        SET "isActive"=false, "purchasedDate"=CURRENT_TIMESTAMP
        WHERE id=$1
        RETURNING *;
      `,
      [orderId]
    );

    const newOrder = await createOrder(removedCart.userId);

    return attachProductsToOrder(newOrder);
  } catch (error) {
    console.log("Error in removeOrder");
    throw error;
  }
}

//empty a cart by userId
//delete and create new order
async function destroyOrder(userId) {
  try {
    const cart = await getOrderByUserId(userId);

    await deleteProducts(cart.id);

    await client.query(
      /*sql*/ `
      DELETE FROM orders
      WHERE "userId"=$1 AND "isActive"=true
      RETURNING *;
    `,
      [userId]
    );

    return await createOrder(userId);
  } catch (error) {
    console.log("Error in destroyOrder");
    throw error;
  }
}

/*
GET /orders/cart
- send back signed in users cart
- if active order, send that order
- if no active order, create a new order
*/
async function getOrderByUserId(userId) {
  try {
    const { rows: cart } = await client.query(
      /*sql*/ `
      SELECT * FROM orders
      WHERE "userId"=$1 AND "isActive"=true;
    `,
      [userId]
    );

    if (cart.length === 0) {
      return await createOrder(userId);
    }

    return await attachProductsToOrder(cart);
  } catch (error) {
    console.log("Error in getOrderByUserId");
    throw error;
  }
}

//GET orders/history - get all inactive orders for user
//see my order history so I can remember my previously purchased items and their prices at the time of purchase.
async function getHistory(userId) {
  try {
    const { rows: history } = await client.query(
      /*sql*/ `
      SELECT * FROM orders 
      WHERE "userId"=$1 AND "isActive"=false;
    `,
      [userId]
    );

    if (history.length === 0) return history;

    return await attachProductsToOrder(history);
  } catch (error) {
    console.log("Error in getHistory");
    throw error;
  }
}

/*
  GET /orders/:orderId - get any order active or inactive
                        - join with line-items
                        - join with product
*/
async function getOrderById(orderId) {
  try {
    const { rows: order } = await client.query(
      /*sql*/ `
      SELECT * FROM orders WHERE id=$1;
    `,
      [orderId]
    );

    return await attachProductsToOrder(order);
  } catch (error) {
    console.log("Error in getOrderById");
    throw error;
  }
}

async function attachProductsToOrder(orders) {
  try {
    const orderIds = orders.map((o) => o.id).join(", "); //3, 11

    const { rows: products } = await client.query(/*sql*/ `
      SELECT p.id AS "productId", p.name, p."imageName", li.quantity, li.price, li."orderId", li.id AS "lineItemId"
      FROM line_items AS li
      JOIN products AS p ON p.id=li."productId"
      WHERE "orderId" IN (${orderIds});
    `); //products for orderId 3, 11

    orders.forEach((order) => {
      order.products = products.filter(
        (product) => product.orderId === order.id
      );
    }); //matching products with orderId 3 and 11

    return orders;
  } catch (error) {
    console.log("Error in attachProductsToOrders");
    throw error;
  }
}

async function addProductToCart({ orderId, productId, price, quantity }) {
  try {
    //check if the product is already in the cart.
    //if I use getOrderByUserId() I will not get productId
    const {
      rows: [lineItem],
    } = await client.query(
      /*sql*/ `
      SELECT * FROM line_items WHERE "productId"=$1 AND "orderId"=$2;  
    `,
      [productId, orderId]
    );

    if (lineItem) {
      return await updateQuantity(lineItem.id, { quantity });
    }

    const {
      rows: [newLineItem],
    } = await client.query(
      /*sql*/ `
      INSERT INTO line_items("productId", "orderId", price, quantity)
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `,
      [productId, orderId, price, quantity]
    );

    return newLineItem;
  } catch (error) {
    console.log("Error in addProductToCart");
    throw error;
  }
}

async function updateQuantity(lineItemId, { quantity }) {
  try {
    const {
      rows: [updated],
    } = await client.query(
      /*sql*/ `
      UPDATE line_items
      SET quantity=$1
      WHERE id=$2
      RETURNING *;
    `,
      [quantity, lineItemId]
    );

    if (updated.quantity === 0) {
      return await removeProductFromCart(lineItemId);
    }

    return updated;
  } catch (error) {
    console.log("Error in updateQuantity");
    throw error;
  }
}

//delete line_items - remove/destory cart and when quantity = 0
async function deleteProducts(orderId) {
  try {
    const { rows: deletedProducts } = await client.query(
      /*sql*/ `
      DELETE FROM line_items
      WHERE "orderId"=$1
      RETURNING *;
    `,
      [orderId]
    );

    return deletedProducts;
  } catch (error) {
    console.log("Error in deleteLineItems");
    throw error;
  }
}

async function removeProductFromCart(lineItemId) {
  try {
    const {
      rows: [removedProduct],
    } = await client.query(
      /*sql*/ `
    DELETE FROM line_items
    WHERE id=$1
    RETURNING *;
    `,
      [lineItemId]
    );

    return removedProduct;
  } catch (error) {
    console.log("Error in removeProductFromCart");
    throw error;
  }
}

module.exports = {
  createOrder,
  getHistory,
  removeOrder,
  destroyOrder,
  getOrderByUserId,
  getOrderById,
  addProductToCart,
  updateQuantity,
  deleteProducts,
  removeProductFromCart,
};
