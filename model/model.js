const { response } = require("../app.js");
const db = require("../db/connection.js");
const reviews = require("../db/data/test-data/reviews.js");

exports.selectCategories = () => {
  return db
    .query(
      `
    SELECT * FROM categories;
    `
    )
    .then((response) => {
      return response.rows;
    });
};

exports.selectReviews = () => {
  return db
    .query(
      `
      SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer,  COUNT(comment_id) AS comment_count
      FROM reviews
      LEFT JOIN comments ON comments.review_id = reviews.review_id
      GROUP BY reviews.review_id
      ORDER BY reviews.created_at DESC;
      `
    )
    .then((response) => {
      response.rows.forEach((review) => {
        review.comment_count = Number(review.comment_count);
        // review.created_at = Date.parse(review.created_at);
        // console.log(typeof (review.created_at));
      });
      return response.rows;
    });
};

exports.selectReviewWithId = (id) => {
  const numberedId = Number(id);
  if (isNaN(numberedId)) {
    return Promise.reject({ status: 400, msg: "Not a valid id" });
  }

  return db
    .query(
      `
    SELECT * FROM reviews
    WHERE review_id = $1
    `,
      [id]
    )
    .then((review) => {
      if (review.rows.length === 0) {
        return Promise.reject({ status: 400, msg: "Invalid id" });
      }
      review.rows[0].created_at = review.rows[0].created_at.toString();
      return review.rows[0];
    });
};

exports.selectComments = (id) => {
  const numberedId = Number(id);
  if (isNaN(numberedId)) {
    return Promise.reject({ status: 400, msg: "Not a valid id" });
  }
  return db
    .query(
      `
    SELECT * from comments
    WHERE review_id = $1
    ORDER BY created_at DESC;
    `,
      [id]
    )
    .then((comments) => {
      if (comments.rows.length === 0) {
        return Promise.reject({ status: 400, msg: "Invalid id" });
      }
      comments.rows.forEach((comment) => {
        comment.created_at = comment.created_at.toString();
      });
      return comments.rows;
    });
};
