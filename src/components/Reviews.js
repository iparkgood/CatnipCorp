import React from "react";
import { SingleReview } from "./index.js";
const Reviews = ({ currentProduct, setCurrentProduct }) => {
  const { reviews } = currentProduct;
  return (
    <div>
      {reviews &&
        reviews.map((review) => {
          return (
            <SingleReview
              key={review.id}
              singleReview={review}
              currentProduct={currentProduct}
              setCurrentProduct={setCurrentProduct}
            />
          );
        })}
    </div>
  );
};

export default Reviews;
