const { response } = require("../app.js");
const db = require("../db/connection.js");

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
      });
      return response.rows;
    });
};
