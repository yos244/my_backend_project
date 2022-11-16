const express = require(`express`);
const comments = require("../db/data/test-data/comments.js");
const reviews = require("../db/data/test-data/reviews.js");
const {
  selectCategories,
  selectReviews,
  selectReviewWithId,
  selectComments,
} = require("../model/model.js");

exports.getCategories = (req, res, next) => {
  selectCategories().then((categories) => {
    res.status(200).send(categories);
  });
};

exports.getReviews = (req, res, next) => {
  selectReviews().then((reviews) => {
    res.status(200).send(reviews);
  });
};

exports.getReviewsWithId = (req, res, next) => {
  selectReviewWithId(req.params.review_id)
    .then((review) => {
      res.status(200).send(review);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (req, res, next) => {
  selectComments(req.params.review_id).then((comments) => {
    res.status(200).send(comments);
  }).catch((err)=>{
    next(err)
  })
};
