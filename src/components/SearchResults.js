import React from "react";
import { Container, Row } from "react-bootstrap";
import { ProductCard } from "./index";

const SearchResults = ({ searchProducts }) => {
  return (
    <Container className="product-container">
      <h3 className="category-header">Search Results</h3>
      <Row>
        {searchProducts && searchProducts.length > 0 ? (
          searchProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <h3>No results</h3>
        )}
      </Row>
    </Container>
  );
};

export default SearchResults;
