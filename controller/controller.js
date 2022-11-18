const express = require(`express`);

const {
  selectCategories,
  selectReviews,
  selectReviewWithId,
  selectComments,
  insertComment,
  editVotes,
  selectUsers,
  selectCommCount,
} = require("../model/model.js");

exports.getCategories = (req, res, next) => {
  selectCategories().then((categories) => {
    res.status(200).send(categories);
  });
};

exports.getReviews = (req, res, next) => {
  selectReviews(req.query).then((reviews) => {
    res.status(200).send(reviews);
  }).catch((err)=>{
    next (err)
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
  selectComments(req.params.review_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  insertComment(req.params.review_id, req.body)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReview = (req, res, next) => {
  editVotes(req.params, req.body.inc_votes)
    .then((review) => {
      res.status(200).send(review);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  selectUsers(req).then((users) => {
    res.status(200).send(users);
  });
};


