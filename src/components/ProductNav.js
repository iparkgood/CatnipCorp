import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Container,
} from "react-bootstrap";
import { fetchCategories, fetchAllProducts } from "../api/products";
import "../css/ProductNav.css";


const ProductNav = ({ setSearchProducts }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const history = useHistory();

  useEffect(async () => {
    const categories = await fetchCategories();
    setCategories(categories);
  }, []);

  useEffect(async () => {
    const allProducts = await fetchAllProducts();
    const filteredProducts = allProducts.filter(
      (product) => product.quantity >= 0
    );
    // setSearchProducts([])
    setProducts(filteredProducts);
  }, []);

  const handleSearch = (event) => {
    setSearchInput(event.target.value);
  };

  const searchProducts = () => {
    const filteredProducts = products.filter((product) => {
      return product.name.toLowerCase().includes(searchInput.toLowerCase());
    });
    setSearchProducts(filteredProducts);
    setSearchInput("");
    history.push("/search")
  };

  return (
      <Navbar expand="lg" id="product-nav">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Link className="category__link" to="/products">All Products</Link>
            {categories.map((category) => {
              let { id, name } = category;
              name = name.charAt(0).toUpperCase() + name.slice(1);
              return (
                <Link
                  key={id}
                  to={`/products/category/${name.toLowerCase()}`}
                  className="category__link"
                >
                  {name}
                </Link>
              );
            })}
          </Nav>
          <Form inline>
            <FormControl
              type="text"
              placeholder="Search"
              className="mr-sm-2"
              value={searchInput}
              onChange={handleSearch}
            />
            <Button variant="outline-success" onClick={searchProducts}>
              Search
            </Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>  );
};

export default ProductNav;
