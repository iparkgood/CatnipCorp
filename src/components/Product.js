import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Form,
  Accordion,
  Card,
} from "react-bootstrap";
import { fetchProductById } from "../api/products";
import { addProductToCart } from "../api";
import "../css/Product.css";

import { useParams, useHistory } from "react-router-dom";
import { Reviews } from "./index.js";
import { UserContext } from "..";

const Product = () => {
  const {
    myOrder,
    setMyOrder,
    total,
    setTotal,
    currentUsername,
    localCart,
    setLocalCart,
  } = useContext(UserContext);
  const [currentProduct, setCurrentProduct] = useState({});
  const [addQuantity, setAddQuantity] = useState(1);

  const history = useHistory();

  let { id } = useParams();

  useEffect(async () => {
    const product = await fetchProductById(id);
    setCurrentProduct(product);
  }, []);

  const { name, description, imageName, price, reviews, quantity } =
    currentProduct;

  // const productReviews = currentProduct.reviews;
  // console.log(productReviews);
  // const ratings = productReviews.map((review) => {
  //   const { rating } = review;
  //   return rating;
  // });
  // console.log(ratings);
  // const r = (acc, value) => acc + value;
  // const averageRating = ratings.reduce(r) / ratings.length;
  // console.log(averageRating);

  let selectQuantity = [];
  for (let i = 1; selectQuantity.length < quantity; i++) {
    selectQuantity.push(i);
  }

  const handleAddToCart = async () => {
    if (currentUsername) {
      const added = await addProductToCart(myOrder.id, id, price, addQuantity);

      const sameProduct = myOrder.products.filter(
        (p) => Number.parseInt(p.productId) === added.productId
      );

      if (sameProduct.length !== 0) {
        const idx = myOrder.products.findIndex(
          (p) => Number.parseInt(p.productId) === added.productId
        );
        myOrder.products[idx].quantity = added.quantity;
      } else {
        const addedProduct = {
          lineItemId: added.id,
          orderId: added.orderId,
          price: added.price,
          productId: id,
          quantity: added.quantity,
          name,
          description,
          imageName,
        };
        myOrder.products.push(addedProduct);
      }

      setMyOrder(myOrder);
      
    } else {
      const lineItem = {
        productId: id,
        name,
        price,
        quantity: addQuantity,
        imageName
      };

      const newLocalCart = localCart;
      newLocalCart.push(lineItem);
      setLocalCart(newLocalCart);

      localStorage.setItem("cart", JSON.stringify(localCart));
    }

    const newTotal = total + (addQuantity * price);
    setTotal(newTotal);

    history.push("/cart");
  };

  return (
    <Container>
      <Row className="product__container">
        <Col>
          <Image
            className="product__image"
            src={`/images/${imageName}`}
            rounded
          />
        </Col>
        <Col className="product__info">
          <h1>{name}</h1>
          <div>{description}</div>
          <Row className="product__footer">
            <div className="button__container">
              <Button
                id="add__product"
                variant="primary"
                onClick={handleAddToCart}
              >
                Add To Cart
              </Button>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Control
                  as="select"
                  value={addQuantity}
                  onChange={(e) => setAddQuantity(e.target.value)}
                >
                  {selectQuantity.map((quantity) => (
                    <option>{quantity}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </div>
            <div className="product__price">${price}</div>
          </Row>
        </Col>
      </Row>
      <Row>
        <Accordion>
          <Card>
            {/* <Card.Header>
              <h5>Average rating: {averageRating}</h5>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Click to see reviews
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Reviews currentProduct={currentProduct} />
              </Card.Body>
            </Accordion.Collapse> */}
          </Card>
        </Accordion>
      </Row>
    </Container>
  );
};

export default Product;
