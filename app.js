const express = require(`express`);
const { getCategories, getReviews } = require("./controller/controller");


const app = express(); 


app.get(`/api/categories`, getCategories)
app.get("/api/reviews", getReviews)

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Not found" });
  });


module.exports = app;  



