import React, { useContext } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { UserContext } from "..";
import "../css/Header.css";

const Header = () => {
  const history = useHistory();
  const { setUser, currentUsername, setCurrentUsername, setTotal } =
    useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUser(null);
    setCurrentUsername("");

    const cart = JSON.parse(localStorage.getItem("cart"));

    !cart
      ? setTotal(0)
      : setTotal(() => {
          return cart.length !== 0
            ? cart.reduce((acc, c) => {
                return acc + c.quantity * c.price;
              }, 0)
            : 0;
        });

    history.push("/");
  };

  return (
    <>
      <Navbar expand="md">
        {/* <Container> */}
          <div onClick={() => history.push("/")}>
            <h2 id="site-title">Catnip Corp.</h2>
          </div>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav" className="justify-content-end">
            <Nav>
              {currentUsername ? (
                <Nav.Link onClick={() => history.push("/authenticated")}>
                  Account
                </Nav.Link>
              ) : (
                <Nav.Link onClick={() => history.push("/register")}>
                  Sign up
                </Nav.Link>
              )}

              {currentUsername ? (
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              ) : (
                <Nav.Link onClick={() => history.push("/login")}>
                  Log in
                </Nav.Link>
              )}

              <Nav.Link onClick={() => history.push("/cart")}>Cart</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        {/* </Container> */}
      </Navbar>
    </>
  );
};

export default Header;
