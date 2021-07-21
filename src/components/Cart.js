import React, { useState, useContext } from "react";
import {
  Row,
  Col,
  ListGroup,
  Form,
  Button,
  Card,
  CloseButton,
  Container,
} from "react-bootstrap";
import { patchQuantity, deleteProductFromCart, patchInactive } from "../api";
import { fetchProductById, updateQuantity } from "../api/products";

import { useHistory } from "react-router-dom";
import { UserContext } from "..";
import "../css/Cart.css";

const Cart = () => {
  const {
    myOrder,
    setMyOrder,
    currentUsername,
    total,
    setTotal,
    orderHistory,
    setOrderHistory,
    localCart,
    setLocalCart,
  } = useContext(UserContext);
  const history = useHistory();

  const renderProducts = currentUsername ? myOrder.products : localCart;

  const handleUpdateQuantity = async (updateId, updateQuantity) => {
    let newTotal = 0;
    if (currentUsername) {
      const updated = await patchQuantity(updateId, updateQuantity); //lineItemId

      const idx = myOrder.products.findIndex((p) => p.lineItemId === updateId);

      const newProducts = [...myOrder.products];
      newTotal = total - newProducts[idx].quantity * newProducts[idx].price;

      const updatedProduct = {
        lineItemId: updated.id,
        orderId: updated.orderId,
        price: updated.price,
        productId: updated.productId,
        quantity: updated.quantity,
        name: myOrder.products[idx].name,
        imageName: myOrder.products[idx].imageName,
      };

      newProducts[idx] = updatedProduct;
      myOrder.products = newProducts;
      setMyOrder(myOrder);

      newTotal = newTotal + newProducts[idx].quantity * newProducts[idx].price;
    } else {
      //no currentUsername - localStorage cart
      const newLocalCart = localCart;
      const updateProduct = newLocalCart.find(
        (lc) => lc.productId === updateId
      ); //productId
      newTotal = total - updateProduct.quantity * updateProduct.price;

      updateProduct.quantity = +updateQuantity;
      newTotal = newTotal + updateProduct.quantity * updateProduct.price;

      setLocalCart(newLocalCart);
      localStorage.setItem("cart", JSON.stringify(newLocalCart));
    }

    setTotal(newTotal);
  };

  const handleDelete = async (deletedId) => {
    let deleted = {};
    if (currentUsername) {
      deleted = await deleteProductFromCart(deletedId); //lineItemId

      const newProducts = myOrder.products.filter(
        (p) => p.lineItemId !== deleted.id
      );

      myOrder.products = newProducts;
      setMyOrder(myOrder);
    } else {
      deleted = localCart.find((lc) => deletedId === lc.productId);
      const newLocalCart = localCart.filter((lc) => deletedId !== lc.productId);

      setLocalCart(newLocalCart);
      localStorage.setItem("cart", JSON.stringify(newLocalCart));
    }
    const newTotal = total - deleted.quantity * deleted.price;
    setTotal(newTotal);
  };

  const handleCheckout = async () => {
    if (currentUsername) {
      myOrder.products.map(async (p) => {
        const { quantity: productQ } = await fetchProductById(p.productId);

        const updatedQ = productQ - p.quantity;

        const updated = await updateQuantity({
          id: p.productId,
          quantity: updatedQ,
        });
      });

      const newOrder = await patchInactive(myOrder.id);

      setOrderHistory([...orderHistory, myOrder]);
      setMyOrder(newOrder);
    }
    setTotal(0);

    history.push("/checkout");
  };

  return (
    <Container>
      <h2 id="cart-header">Your shopping cart</h2>
      {
        <Row>
          <Col md={8}>
            {renderProducts && (
              <ListGroup>
                {renderProducts.map((p) => {
                  return (
                    <ListGroup.Item key={p.productId}>
                      <Row
                        style={{
                          alignItems: "center",
                        }}
                      >
                        <CloseButton
                          onClick={() =>
                            p.lineItemId
                              ? handleDelete(p.lineItemId)
                              : handleDelete(p.productId)
                          }
                        />
                        <Col xs={3}>
                          <img src={`/images/${p.imageName}`} width="120px" />
                        </Col>
                        <Col
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {p.name}
                          <span style={{ color: "red" }}>
                            ${Number.parseFloat(p.price)}
                          </span>
                        </Col>
                        <Col xs={3}>
                          <Form.Control
                            as="select"
                            defaultValue={p.quantity}
                            style={{ marginBottom: "10px" }}
                            onChange={(e) => {
                              p.lineItemId
                                ? handleUpdateQuantity(
                                    p.lineItemId,
                                    e.target.value
                                  )
                                : handleUpdateQuantity(
                                    p.productId,
                                    e.target.value
                                  );
                            }}
                          >
                            {[...Array(50)].map((_, idx) => (
                              <option key={idx}>{idx + 1}</option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            )}
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body style={{ width: "100%" }}>
                <Card.Title
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  Total:
                  <span style={{ color: "red" }}>${total.toFixed(2)}</span>
                </Card.Title>
                <Button
                  variant="primary"
                  block
                  onClick={handleCheckout}
                  disabled={
                    !renderProducts || renderProducts.length === 0
                      ? true
                      : false
                  }
                >
                  Checkout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      }
    </Container>
  );
};

export default Cart;
