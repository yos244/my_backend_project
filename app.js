const express = require(`express`);
const {
  getCategories,
  getReviews,
  getReviewsWithId,
  getComments,
  postComment,
  patchReview,
  getUsers,
} = require("./controller/controller");

const app = express();
app.use(express.json());

app.get(`/api/categories`, getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewsWithId);

app.get("/api/reviews/:review_id/comments", getComments);

app.post("/api/reviews/:review_id/comments", postComment);

app.patch("/api/reviews/:review_id", patchReview);

app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  console.log(err.code);
  if (err.code === `22P02`) {
    res.status(400).send({ msg: `Invalid data type` });
  }
  if (err.code === `23502`) {
    res.status(400).send({ msg: `Invalid data type` });
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

module.exports = app;
