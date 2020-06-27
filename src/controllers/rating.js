const ratingModel = require("../models/rating");
const booksModels = require("../models/books");

const helper = require("../helpers");

module.exports = {
    getAllRating: async function (req, res) {
        try {
            const result = await ratingModel.getAllRating();

            return helper.response(res, 200, result);
        } catch (error) {
            return helper.response(res, 500, error);
        }
    },
    postRating: async function (req, res) {
        try {
            const setData = req.body;
            setData.rating = req.body.rating;
            setData.id_book = req.params.id;
            const id_book = req.params.id;

            const resultRating = await ratingModel.postRating(setData);
            const dataBook = await ratingModel.getRatingByIdBook(id_book)
            let totalRating = 0;
            for (let i = 0; i < dataBook.length; i++) {
                totalRating += dataBook[i]['rating'];

            }
            let ratingAverage = (totalRating / dataBook.length).toFixed(1);
            //   const book = await booksModels.getBookById(id_book);
            await booksModels.putBook({ rating: ratingAverage }, id_book);
            return helper.response(res, 200, resultRating);
        } catch (error) {
            console.log(error)
            return helper.response(res, 500, error);
        }
    },
};
