const { createReview } = require("./reviews");

const createInitialReviews = async () => {
  console.log("Starting to create users...");
  try {
    const reviewsToCreate = [
      {
        comment: "great quality!",
        rating: 5,
        userId: 1,
        productId: 2,
      },
      {
        comment: "did not like",
        rating: 3,
        userId: 1,
        productId: 3,
      },
      {
        comment: "was too big!",
        rating: 4,
        userId: 2,
        productId: 3,
      },
      {
        comment: "runs large",
        rating: 4,
        userId: 5,
        productId: 3,
      },
      {
        comment: "my favorite",
        rating: 5,
        userId: 3,
        productId: 3,
      },
      {
        comment: "my dog enjoyed it",
        rating: 5,
        userId: 3,
        productId: 4,
      },
      {
        comment: "could have more taste",
        rating: 4,
        userId: 4,
        productId: 5,
      },
      {
        comment: "feels too tight",
        rating: 2,
        userId: 5,
        productId: 6,
      },
      {
        comment: "wears out too fast",
        rating: 3,
        userId: 6,
        productId: 7,
      },
      {
        comment: "love the product",
        rating: 5,
        userId: 7,
        productId: 8,
      },
      {
        comment: "my cat hated it",
        rating: 2,
        userId: 8,
        productId: 9,
      },
    ];
    const reviews = await Promise.all(reviewsToCreate.map(createReview));
    console.log(reviews);
  } catch (error) {
    console.error("initialReviews failed", error);
  }
};

module.exports = createInitialReviews;
