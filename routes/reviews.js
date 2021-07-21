// REVIEWS
// POST /reviews/:productId
// - posts one review to product
// - must be logged in
// - purchased product
// PATCH /reviews/:reviewId
// - edit one review
// - check is user id matches author id
// DELETE /reviews/:reviewId
// - admin too
// - deletes one review
// - check is user id matches author id

const express = require("express");
const reviewsRouter = express.Router();

const {
  createReview,
  updateReview,
  deleteReview,
  getReviewById,
} = require("../db/reviews");
const { requireUser } = require("./utils");
const { getHistory } = require("../db/orders");

// reviewsRouter.post("/:productId", requireUser, async (req, res, next) => {
//   const { comment, rating } = req.body;
//   const { productId } = req.params;
//   const userId = req.user.id;

//   const pastOrders = await getHistory(userId);
//   const products = pastOrders.map((order) => {
//     return order.products.filter((product) => {
//       return product.productId === productId;
//     });
//   });
//   console.log(products);
//   if (products.length > 0) {
//     try {
//       const newReview = await createReview({
//         comment,
//         rating,
//         userId,
//         productId,
//       });
//       res.send(newReview);
//     } catch (error) {
//       console.log("postReview", error);
//       next(error);
//     }
//   } else {
//     console.error("You did not purchase this product and can not leave a review");
//   }
// });

reviewsRouter.post("/:productId", requireUser, async (req, res, next) => {
  const { comment, rating } = req.body;
  const { productId } = req.params;
  const userId = req.user.id;
  console.log("USER", req.user)

  // const pastOrders = await getHistory(userId);
  // const products = pastOrders.map((order) => {
  //   return order.products.filter((product) => {
  //     return product.productId === productId;
  //   });
  // });
  // console.log(products);
    try {
      const newReview = await createReview({
        comment,
        rating,
        userId,
        productId,
      });
      console.log(newReview)
      res.send(newReview);
    } catch (error) {
      console.log("postReview", error);
      next(error);
    }
});

reviewsRouter.patch("/:reviewId", requireUser, async (req, res, next) => {
  const { reviewId } = req.params;
  const { user } = req;
  const { comment, rating } = req.body;
  const updatingFields = {};
  const reviewToUpdate = await getReviewById(reviewId);
  if (comment) {
    updatingFields.comment = comment;
  }
  if (rating) {
    updatingFields.rating = rating;
  }
  if (user.id === reviewToUpdate.userId) {
    try {
      const updatedReview = await updateReview(reviewId, updatingFields);
      res.send(updatedReview);
    } catch (error) {
      console.log("updateReview", error);
      next(error);
    }
  } else {
    next(error);
  }
});

reviewsRouter.delete("/:reviewId", requireUser, async (req, res, next) => {
  const { reviewId } = req.params;
  const { user } = req;
  const reviewToDelete = await getReviewById(reviewId);
  console.log("DELETING REVIEW", reviewToDelete);
  if (user.id === reviewToDelete.userId || user.isAdmin === true) {
    try {
      const deletedReview = await deleteReview(reviewId);
      res.send(deletedReview);
    } catch (error) {
      console.log("deleteReview", error);
      next(error);
    }
  } else {
    next(error);
  }
});

module.exports = reviewsRouter;
