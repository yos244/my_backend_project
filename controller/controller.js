const express = require(`express`)
const { selectCategories, selectReviews } = require("../model/model.js")


exports.getCategories = (req,res,next) =>{
    selectCategories().then((categories) =>{
        res.status(200).send(categories)
    })
}

exports.getReviews = (req,res,next) => {
selectReviews().then((reviews)=>{
    console.log(reviews);
    res.status(200).send(reviews)
})
}