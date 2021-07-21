const { createOrder, addProductToCart } = require("./index");

const createInitialOrders = async () => {
  try {
    console.log("Creating orders");

    const ordersToCreate = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const orders = await Promise.all(ordersToCreate.map(createOrder));

    console.log("Finished creating orders");
    console.log(orders);
  } catch (error) {
    console.log("Trouble creating new orders");
    console.dir(error);
  }
};
//addProductToCart({ productId, orderId, price, quantity })
const createInitialLineItems = async () => {
  try {
    console.log("Creating line items");

    const lineItemsToCreate = [
      { productId: 2, orderId: 5, price: 15, quantity: 2 },
      { productId: 4, orderId: 5, price: 10, quantity: 3 },
      { productId: 2, orderId: 6, price: 15, quantity: 2 },
      { productId: 3, orderId: 6, price: 15, quantity: 1 },
      { productId: 5, orderId: 7, price: 10, quantity: 5 },
      { productId: 7, orderId: 7, price: 5, quantity: 2 },
      { productId: 5, orderId: 9, price: 10, quantity: 2 },
      { productId: 4, orderId: 9, price: 10, quantity: 3 },
    ];

    const lineItems = await Promise.all(
      lineItemsToCreate.map(addProductToCart)
    );

    console.log("Finished creating line items");
    console.log(lineItems);
  } catch (error) {
    console.log("Trouble creating new line items");
    console.dir(error);
  }
};

module.exports = { createInitialOrders, createInitialLineItems };
