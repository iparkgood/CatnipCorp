import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "..";
import { Form, Button } from "react-bootstrap";
import { loginUser } from "../api/users";

const mystyle = {
  padding: "1rem",
  margin: "1rem",
  display: "flex",
  justifyContent: "center",
};

const Login = () => {
  const history = useHistory();
  const { setUser, setCurrentUsername } = useContext(UserContext);

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
        history.push("/authenticated");
      }
    });
  };

  return (
    <div style={mystyle}>
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
