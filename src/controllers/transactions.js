const transactionModel = require('../models/transactions');
const booksModel = require('../models/books');

const helper = require('../helpers');


module.exports = {
    getAllTransactions: async function (req, response) {
        try {

            const result = await transactionModel.getAllTransactions();
            return helper.response(response, 200, result);
        } catch (error) {
            console.log(error)
            return helper.response(response, 500, error);
        }
    },
    getTransactionsByUser: async function (request, response) {
        try {
            var user_id = 0
            if(request.token.result.id===undefined){
                user_id = request.token.result.result.id
              
         }
         else {
            user_id = request.token.result.id
    
         }
            // const id = request.params.id
            const count = await transactionModel.getCountTransactionsUser(user_id);
            const result = await transactionModel.getTransactionsByUser(user_id);

            //   const totalData = data[0]["COUNT(*)"];
            //   const totalPage = Math.ceil(totalData / limit);
            let totalPrice = 0;
            for (let i = 0; i < result.length; i++) {
                totalPrice += result[i].price;
            }
            const invoice = {
                totalItem: count[0]['count'],
                totalPrice,
                invoice: result
            };

            return helper.response(response, 200, invoice);
        } catch (error) {
            console.log(error)
            return helper.response(response, 500, error);
        }
    },
    postTransaction: async function (request, response) {



        try {
            const id_buyer = request.body.id_buyer;

            //  console.log("asdass"+request.token.result)
            const id_book = request.params.id
            const dataBook = await booksModel.getBookById(id_book)

            // console.log("asdass"+request.token.result.id)
            const postResult = await transactionModel.postTransaction(id_buyer, id_book, dataBook.id_user)
            const result = await transactionModel.getTransactionsById(postResult.id)

            // await borrowModels.borrowedBook(book_id)
            return helper.response(response, 200, { message: "Book succesfully added to transaction list", result })



        } catch (error) {
            console.log(error)
            return helper.response(response, 500, { message: "Book Failed to added to borrow list succesfull" })

        }

    },
    putTransactionStatus: async function (request, response) {



        try {
            const id_transaction = request.params.id;

            //  console.log("asdass"+request.token.result)
            const id_book = request.params.id
            const data = await transactionModel.putTransactionStatus("Sudah Dibayar",id_transaction)

            // console.log("asdass"+request.token.result.id)
            // const postResult = await transactionModel.postTransaction(id_buyer, id_book, dataBook.id_user)
            const result = await transactionModel.getTransactionsById(data.id)

            // await borrowModels.borrowedBook(book_id)
            return helper.response(response, 200, { message: "the bill has been paid", result })

        } catch (error) {
            console.log(error)
            return helper.response(response, 500, { message: "Book Failed to added to borrow list succesfull" })

        }

    },
}