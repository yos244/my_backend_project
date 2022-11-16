const express = require(`express`);
const { getCategories, getReviews, getReviewsWithId } = require("./controller/controller");


const app = express(); 


app.get(`/api/categories`, getCategories)
app.get("/api/reviews", getReviews) 
app.get("/api/reviews/:review_id", getReviewsWithId)

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Not found" });
  });

app.use ((err,req,res,next)=>{
    res.status(err.status).send({ msg: err.msg })
})
module.exports = app;  



