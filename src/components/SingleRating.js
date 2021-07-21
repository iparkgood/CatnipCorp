import React, { useContext } from "react";
import { FaStar } from "react-icons/fa";

const SingleRating = ({ singleReview }) => {
  const { rating } = singleReview;

  return (
    <div>
      {[...Array(rating)].map((star, i) => {
        const value = i + 1;
        return (
          <label key={value}>
            <FaStar color={"#ffc107"}/>
          </label>
        );
      })}
    </div>
  );
};

export default SingleRating;
