import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "..";
import { Form, Button } from "react-bootstrap";
import { registerUser } from "../api/users";
import { addProductToCart, getOrderByUser } from "../api";
import '../css/User.css'


const mystyle = {
  padding: "1rem",
  margin: "1rem",
  display: "flex",
  justifyContent: "center",
};

const Register = () => {
  const history = useHistory();
  const { setUser, setCurrentUsername, setMyOrder, setTotal, setLocalCart } =
    useContext(UserContext);

  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitHandler = (event) => {
    event.preventDefault();

    if (passwordInput !== confirmPasswordInput) {
      return alert("passwords do not match!");
    }
    setIsLoading(true);

    registerUser(usernameInput, emailInput, passwordInput).then((result) => {
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

  const usernameChangeHandler = (event) => {
    event.preventDefault();
    setUsernameInput(event.target.value);
  };

  const emailChangeHandler = (event) => {
    event.preventDefault();
    setEmailInput(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    event.preventDefault();
    setPasswordInput(event.target.value);
  };

  const confirmPasswordChangeHandler = (event) => {
    event.preventDefault();
    setConfirmPasswordInput(event.target.value);
  };

  const handleLocalCart = async () => {
    const orderForUser = await getOrderByUser();
    const cart = JSON.parse(localStorage.getItem("cart"));

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

    orderForUser.products = [];
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
        <h2 style={{ margin: "0.7rem" }}>Please Register</h2>
        {error && <p style={{ color: "red", margin: "0.7rem" }}>{error}</p>}

        <Form.Group style={{ margin: "0.7rem" }} controlId="formRegisterUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            placeholder="username"
            value={usernameInput}
            onChange={usernameChangeHandler}
          />
        </Form.Group>

        <Form.Group style={{ margin: "0.7rem" }} controlId="formRegisterEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="username@email.com"
            value={emailInput}
            onChange={emailChangeHandler}
          />
        </Form.Group>

        <Form.Group style={{ margin: "0.7rem" }} controlId="formRegisterPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={passwordInput}
            onChange={passwordChangeHandler}
          />
          <Form.Text className="text-muted">
            Password must be more than 8 characters.
          </Form.Text>
        </Form.Group>

        <Form.Group style={{ margin: "0.7rem" }} controlId="formRegisterConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPasswordInput}
            onChange={confirmPasswordChangeHandler}
          />
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

export default Register;
