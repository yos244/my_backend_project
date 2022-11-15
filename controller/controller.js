const { response } = require("../app")
const { selectCategories } = require("../model/model.js")

exports.getCategories = (req,res,next) =>{
    selectCategories().then((categories) =>{
        res.status(200).send(categories)
    })
}