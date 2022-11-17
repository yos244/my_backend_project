const express = require(`express`);
const {
  getCategories,
  getReviews,
  getReviewsWithId,
  getComments,
  postComment,
} = require("./controller/controller");


const app = express();
app.use(express.json());

app.get(`/api/categories`, getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewsWithId);

app.get("/api/reviews/:review_id/comments", getComments)

app.post("/api/reviews/:review_id/comments", postComment)

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});


module.exports = app;
