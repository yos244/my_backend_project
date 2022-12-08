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

exports.selectReviews = (query) => {
  let order_by = `desc`;
  let sort_by = `created_at`;
  if (query.sort_by) {
    if (
      ![
        `title`,
        `designer`,
        `owner`,
        `review_img_url`,
        `review_body`,
        `category`,
        `created_at`,
        `votes`,
      ].includes(query.sort_by)
    ) {
      return Promise.reject({ status: 400, msg: `Invalid sort query` });
    }
    sort_by = query.sort_by;
  }
  if (query.order_by) {
    if (query.order_by !== `asc` && query.order_by !== `desc`) {
      return Promise.reject({ status: 400, msg: `Invalid order by query` });
    }
    order_by = query.order_by;
  }

  const queryStr1 = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, 
  reviews.designer, COUNT(comment_id) AS comment_count FROM reviews 
  LEFT JOIN comments ON comments.review_id = reviews.review_id`;
  const querCat = ` WHERE category = '${query.category}'`;
  const queryStr2 = ` GROUP BY reviews.review_id
  ORDER BY reviews.${sort_by} ${order_by};`;
  if (query.hasOwnProperty(`category`)) {
    if (
      ![
        `euro game`,
        `dexterity`,
        `social deduction`,
        `children's games`,
      ].includes(query.category)
    ) {
      return Promise.reject({ status: 400, msg: `Invalid category` });
    }
    if (query.category.includes("'")) {
      query.category = query.category.replace("'", "''");
    }
    return db
      .query(
        `
    SELECT * FROM reviews
    WHERE category = '${query.category}'
    `
      )
      .then((results) => {
        if (!results.rows[0]) {
          console.log(results.rows);
          return results.rows;
        }
        return db
          .query(`${queryStr1} ${querCat} ${queryStr2}`)
          .then((revCat) => {
            return revCat.rows;
          });
      });
  }
  return db
    .query(
      `
        ${queryStr1} ${queryStr2}
        `
    )
    .then((response) => {
      response.rows.forEach((review) => {
        review.comment_count = Number(review.comment_count);
      });
      return response.rows;
    });
};





// exports.selectReviews = () => {
//   return db
//     .query(
//       `
//       SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer,  COUNT(comment_id) AS comment_count
//       FROM reviews
//       LEFT JOIN comments ON comments.review_id = reviews.review_id
//       GROUP BY reviews.review_id
//       ORDER BY reviews.created_at DESC;
//       `
//     )
//     .then((response) => {
//       response.rows.forEach((review) => {
//         review.comment_count = Number(review.comment_count);
//         // review.created_at = Date.parse(review.created_at);
//         // console.log(typeof (review.created_at));
//       });
//       return response.rows;
//     });
// };

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
  SELECT * from reviews
  `
    )
    .then((reviews) => {
      if (id > reviews.rows.length) {
        return Promise.reject({ status: 400, msg: "Invalid id" });
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
            return comments.rows;
          }
          comments.rows.forEach((comment) => {
            comment.created_at = comment.created_at.toString();
          });
          return comments.rows;
        });
    });
};

exports.insertComment = (revId, { body, username }) => {
  return db
    .query(
      `
  SELECT * FROM reviews`
    )
    .then((response) => {
      if (
        revId > response.rows.length ||
        isNaN(revId) ||
        !body ||
        body.trim().length === 0
      ) {
        return Promise.reject({ status: 400, msg: `Invalid id` });
      }
      return db
        .query(
          `
      SELECT * from users
      `
        )
        .then((users) => {
          let checkUsername = false;
          users.rows.forEach((user) => {
            if (user.username === username) {
              checkUsername = true;
            }
          });
          if (checkUsername === true) {
            return db
              .query(
                `
INSERT INTO comments 
(review_id, author, body) 
VALUES 
($1,$2,$3) 
RETURNING *; 
`,
                [revId, username, body]
              )
              .then((response) => {
                return response.rows[0];
              });
          } else {
            return Promise.reject({ status: 400, msg: `Invalid username` });
          }
        });
    });
};

exports.editVotes = ({ review_id }, voteInc) => {

  return db
    .query(
      `
  SELECT * FROM reviews
  `
    )
    .then((allReviews) => {
      if (review_id > allReviews.rows.length) {
        return Promise.reject({ status: 400, msg: `Id does not exist` });
      }

      return db
        .query(
          `
  UPDATE reviews
  SET votes = votes + $2
  WHERE review_id = $1
  RETURNING *
  
  ;
  `,
          [review_id, voteInc]
        )
        .then((updatedReview) => {
          return updatedReview.rows[0];
        });
    });
};

exports.selectUsers = () =>{
  return db.query(`
  SELECT * FROM users
  `).then((users)=>{
     return(users.rows)
  })
}


exports.removeComment = (id) => {
  return db
    .query(
      `
  SELECT * FROM comments
  WHERE comment_id = $1;
  `,
      [id]
    )
    .then((comments) => {
      if (comments.rows.length === 0) {
        return Promise.reject({ status: 400, msg: `Id does not exist` });
      }
      return db.query(
        `
    DELETE FROM comments
    WHERE comment_id = $1;
    `,
        [id]
      );
    });
};