import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "..";
import { Form, Button } from "react-bootstrap";
import { loginUser } from "../api/users";
import { addProductToCart, getOrderByUser } from "../api";
import "../css/User.css";

const mystyle = {
  padding: "1rem",
  margin: "1rem",
  display: "flex",
  justifyContent: "center",
};

const Login = () => {
  const history = useHistory();
  const { setUser, setCurrentUsername, setMyOrder, setTotal, setLocalCart } =
    useContext(UserContext);

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const usernameChangeHandler = (e) => {
    e.preventDefault();
    setUsernameInput(e.target.value);
  };

  const passwordChangeHandler = (e) => {
    e.preventDefault();
    setPasswordInput(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

    loginUser(usernameInput, passwordInput).then((result) => {
      const { user, error } = result;
      setIsLoading(false);
      if (error) {
        setError(error);
      }
      if (user) {
        setUser(user);
        setCurrentUsername(user.username);

        if (localStorage.getItem("cart")) {
          handleLocalCart();
        }

        history.push("/authenticated");
      }
    });
  };

  const handleLocalCart = async () => {
    const orderForUser = await getOrderByUser();
    const cart = JSON.parse(localStorage.getItem("cart"));

    let existing = [];

    if (!orderForUser.hasOwnProperty("products")) {
      orderForUser.products = [];
    }

    if (orderForUser.products.length !== 0) {
      //there are products in order
      existing = orderForUser.products.filter((p) => {
        return cart.find((c) => +c.productId === p.productId);
      });

      if (existing.length !== 0) {
        //products already exist
        existing.forEach((e) => {
          cart.forEach((c) => {
            if (e.productId === c.productId) {
              c.quantity = +c.quantity + +e.quantity;
            }
          });
        });

        const filteredProducts = orderForUser.products.filter((p) => {
          return existing.find((c) => +c.productId !== p.productId);
        });

        orderForUser.products = filteredProducts; //remove exsiting products to add later from added/cart
      }
    }

    const added = await Promise.all(
      cart.map((c) =>
        addProductToCart(orderForUser.id, c.productId, c.price, c.quantity)
      )
    );

    const shapedProducts = cart.map((c) => {
      const same = added.find((a) => a.productId === c.productId);

      const obj = {
        lineItemId: same.id,
        orderId: same.orderId,
        price: +same.price,
        productId: same.productId,
        quantity: +same.quantity,
        name: c.name,
        imageName: c.imageName,
      };

      return obj;
    });

    shapedProducts.forEach((s) => {
      orderForUser.products.push(s);
    });

    setMyOrder(orderForUser);
    setTotal(() => {
      return orderForUser.products.reduce((acc, p) => {
        return acc + p.quantity * p.price;
      }, 0);
    });
    setLocalCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <div style={mystyle} className="auth-form">
      <Form style={{ width: "30rem" }}>
        <h2 style={{ margin: "0.7rem" }}>Please Login</h2>
        {error && <p style={{ color: "red", margin: "0.7rem" }}>{error}</p>}

        <Form.Group style={{ margin: "0.7rem" }} controlId="formLoginUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            placeholder="Enter username"
            value={usernameInput}
            onChange={usernameChangeHandler}
          />
        </Form.Group>

        <Form.Group style={{ margin: "0.7rem" }} controlId="formLoginPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={passwordInput}
            onChange={passwordChangeHandler}
          />
        </Form.Group>

        <Form.Group style={{ margin: "0.7rem" }} controlId="formLoginCheckbox">
          <Form.Check type="checkbox" label="Remember me" />
        </Form.Group>

        <Button
          style={{ margin: "0.7rem" }}
          variant="primary"
          type="submit"
          onClick={submitHandler}
          disabled={isLoading}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Login;
