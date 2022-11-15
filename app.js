const express = require(`express`);
const { getCategories } = require("./controller/controller");


const app = express(); 


app.get(`/api/categories`, getCategories)

module.exports = app; 