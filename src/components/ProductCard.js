import React from "react";
import { Card, Button } from "react-bootstrap";
import "../css/Product.css";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { id, name, price, imageName, quantity } = product;

  return (
    <Link to={`/products/${id}`}>
      <Card className="product-card" style={{ width: "18rem" }}>
        <Card.Img variant="top" src={`/images/${imageName}`} />
        <Card.Body className="product-card-body">
          <Card.Title>{name}</Card.Title>
          <Card.Text>
            <div>${price}</div>
            {quantity === 0 && <div>Out of Stock!</div>}
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default ProductCard;
