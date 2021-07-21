import React, { useState, useEffect, useContext } from "react";
import { ProductCard, AdminProductPage, ProductNav } from "./index";
import { Switch, Route, Redirect } from "react-router-dom";
import { fetchAllProducts } from "../api/products";
import { Container, Row } from "react-bootstrap";
import { UserContext } from "..";

const Products = ({ setSearchProducts, searchProducts }) => {
  const [products, setProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  // const [searchProducts, setSearchProducts] = useState([]);

  const { user } = useContext(UserContext);

  useEffect(async () => {
    const allProducts = await fetchAllProducts();
    const filteredProducts = allProducts.filter(
      (product) => product.quantity >= 0
    );
    setProducts(filteredProducts);
  }, [availableProducts]);

  useEffect(async () => {
    setProducts(searchProducts);
  }, [searchProducts]);

  return (
    <>
      <Switch>
        <Route path="/products">
          <Container className="product-container">
            <h3 className="category-header">
              {searchProducts && searchProducts.length > 0
                ? `Search Results`
                : `All Products`}
            </h3>
            <Row>
              {products &&
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </Row>
          </Container>
        </Route>
        <Route path="/admin">
          {user && user.isAdmin === false ? (
            <Redirect to="/" />
          ) : (
            <AdminProductPage
              products={products}
              setProducts={setProducts}
              setAvailableProducts={setAvailableProducts}
            />
          )}
        </Route>
      </Switch>
    </>
  );
};

export default Products;
