<<<<<<< HEAD
const client = require("./client");

async function createOrder({ userId }) {
    try {
      const {
        rows: [order],
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
      console.error(error);
    }
  }

module.exports = {
  createOrder
};


=======
const client = require("./client");

async function createOrder(userId) {
  try {
    const {
      rows: [order],
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
      rows: [removedCart],
    } = await client.query(
      /*sql*/ `
      UPDATE orders
      SET "isActive"=false
      WHERE id=$1;
    `,
      [orderId]
    );

    return removedCart;
  } catch (error) {
    console.log("Error in removeOrder");
    throw error;
  }
}

//empty a cart by userId
//delete and create new order
async function destroyOrder(userId) {
  try {
    await client.query(
      /*sql*/ `
      DELETE FROM orders
      WHERE "userId"=$1;
    `,
      [userId]
    );

    return await createOrder(userId);
  } catch (error) {
    console.log("Error in deleteOrder");
    throw error;
  }
}

/*
GET /orders/cart
- send back signed in users cart
- if active order, send that order
- if no active order, create a new order
*/
async function getCartByUserId(userId) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      /*sql*/ `
      SELECT * FROM orders
      WHERE "userId"=$1 AND "isActive"=true;
    `,
      [userId]
    );

    if (!cart) {
      return await createOrder(userId);
    }

    return cart;
  } catch (error) {
    console.log("Error in getOrderByUserId");
    throw error;
  }
}

//GET orders/history - get all inactive orders for user
async function getHistory(userId) {
  try {
    const { rows: history } = await client.query(
      /*sql*/ `
      SELECT * FROM orders 
      WHERE "userId"=$1 AND "isActive"=false;
    `,
      [userId]
    );

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
async function getAllOrders(orderId) {
  try {
    const { rows: allOrders } = await client.query(
      /*sql*/ `
      SELECT * FROM orders WHERE id=$1
    `,
      [orderId]
    );

    return await attachProductsToOrder(allOrders);
  } catch (error) {
    console.log("Error in getAllOrders");
    throw error;
  }
}

async function attachProductsToOrder(orders) {
  try {
    const orderIds = orders.map((o) => o.id).join(", ");

    const { rows: products } = await client.query(/*sql*/ `
      SELECT p.id AS "productId", p.name, p.description, p."imageName", li.quantity, li.price 
      FROM line_items AS li
      JOIN products AS p ON p.id=li."productId"
      WHERE "orderId" IN (${orderIds});
    `);

    orders.forEach((order) => {
      order.products = products.filter(
        (product) => product.orderId === order.id
      );
    });

    return orders;
  } catch (error) {
    console.log("Error in attachProductsToOrders");
    throw error;
  }
}

async function addProductToCart({ productId, orderId, price, quantity }) {
  try {
    //check if the product is already in the cart.
    //if I use getCartByUserId() I will not get productId
    const {
      rows: [product],
    } = await client.query(/*sql*/ `
      SELECT * FROM line_items WHERE "productId"=${productId};  
    `);

    if (product) {
      return await updateQuantity(product.productId, quantity);
    }

    const {
      rows: [line_item],
    } = await client.query(
      /*sql*/ `
      INSERT INTO line_items("productId", "orderId", price, quantity)
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `,
      [productId, orderId, price, quantity]
    );

    return line_item;
  } catch (error) {
    console.log("Error in addProductToCart");
    throw error;
  }
}

async function updateQuantity(productId, quantity) {
  try {
    const { rows: updatedQuantity } = await client.query(/*sql*/ `
      UPDATE line_items
      SET quantity=${quantity}
      WHERE "productId"=${productId}
      RETURNING *;
    `);

    return updatedQuantity;
  } catch (error) {
    console.log("Error in updateQuantity");
    throw error;
  }
}

//delete line_items - remove/destory cart and when quantity = 0

module.exports = {
  createOrder,
  getHistory,
  removeOrder,
  destroyOrder,
  getCartByUserId,
  getAllOrders,
  addProductToCart,
  updateQuantity
};
>>>>>>> 8e18920c89cbf5f81354b845ab0484380f78ab25
