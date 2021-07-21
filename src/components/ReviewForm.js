import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import StarRating from "./StarRating";
import { createReview } from "../api/reviews";
import { UserContext } from "..";

const ReviewForm = ({ currentProduct, setCurrentProduct }) => {
  const { reviews, id } = currentProduct;
  const { user } = useContext(UserContext);
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === null) {
      alert("rate this!");
      return;
    }
    try {
      const newReview = await createReview({ comment, rating, productId: id });
      console.log(newReview);
      newReview.username = user.username;
      const newProduct = { ...currentProduct };
      newProduct.reviews = [...newProduct.reviews, newReview];
      setCurrentProduct(newProduct);
      setRating(null);
      setComment("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <StarRating rating={rating} setRating={setRating} />
        <h6>Rate this product</h6>
      </Form.Group>
      <Form.Group controlId="reviewComment">
        <Form.Control
          type="text"
          placeholder="Please share your experience with the product"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Form.Group>{" "}
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default ReviewForm;
