import axios from "axios";
import { getTokenConfig } from "./token";

const URL = `http://localhost:3000/api`;

export async function getOrderByUser() {
  const { config } = getTokenConfig();

  try {
    const result = await axios.get(`${URL}/orders/cart`, config);
    const data = result.data;

    return data;
  } catch (error) {
    console.log("Error in api/getOrderByUser");
    throw error;
  }
}

export async function getOrderHistory() {
  const { config } = getTokenConfig();

  try {
    const { data } = await axios.get(`${URL}/orders/history`, config);

    return data;
  } catch (error) {
    console.log("Error in api/getOrderHistory");
    throw error;
  }
}

export async function patchQuantity(lineItemId, quantity) {
  const { config } = getTokenConfig();

  try {
    const { data } = await axios.patch(
      `${URL}/orders/${lineItemId}/quantity`,
      {
        quantity,
      },
      config
    );

    return data;
  } catch (error) {
    console.log("Error in api/patchQuantity");
    throw error;
  }
}

export async function deleteProductFromCart(lineItemId) {
  const { config } = getTokenConfig();

  try {
    const { data } = await axios.delete(`${URL}/orders/${lineItemId}`, config);

    return data;
  } catch (error) {
    console.log("Error in api/deleteProductFromCart");
    throw error;
  }
}

export async function addProductToCart(
  orderId,
  productId,
  price,
  quantity,
) {
  const { config } = getTokenConfig();

  try {
    const { data } = await axios.post(
      `${URL}/orders/${orderId}`,
      { productId, price, quantity },
      config
    );
    return data;
  } catch (error) {
    console.log("Error in api/postProductToCart");
    throw error;
  }
}

export async function patchInactive(orderId) {
  const { token } = getTokenConfig();

  try {
    const response = await fetch(`${URL}/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();

    return result;
  } catch (error) {
    console.log("Error in api/patchInactive");
    throw error;
  }
}
