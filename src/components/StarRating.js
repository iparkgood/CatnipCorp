import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./StarRating.css";
const StarRating = ({rating, setRating}) => {
  const [hover, setHover] = useState(null);
  return (
    <div>
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;

        return (
          <label key={i}>
            <input
              type="radio"
              name={`rating-${i}`}
              value={ratingValue}
              onClick={() => {
                setRating(ratingValue);
                console.log(ratingValue);
              }}
            />
            <FaStar
              className="star"
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#675A57"}
              size={20}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
