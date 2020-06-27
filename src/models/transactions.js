const connection = require('../config/mysql');

const fs =require('fs');

module.exports = {
    getCountTransactions: function () {
        return new Promise(function (resolve, reject) {
          connection.query(
            `SELECT COUNT(*) as count FROM transactions`,
            function (err, result) {
              if (!err) {
                resolve(result);
              } else {
                reject(new Error(err));
              }
            }
          );
        });
      },
      getAllTransactions: function () {
        return new Promise(function (resolve, reject) {
          connection.query(
            `SELECT transactions.id, transactions.id_book, books.title,books.image as image_book, transactions.created_at,transactions.updated_at,transactions.id_buyer,user.name as name, transactions.id_seller,books.price, transactions.status FROM transactions INNER JOIN books ON books.id = transactions.id_book INNER JOIN user ON transactions.id_buyer = user.id ORDER BY created_at DESC `,
            function (err, result) {
              if (!err) {
                resolve(result);
              } else {
                reject(new Error(err));
              }
            }
          );
        });
      },
      getTransactionsByUser: function (id) {
        return new Promise(function (resolve, reject) {
          connection.query(
            `SELECT transactions.id, transactions.id_book,books.title, books.image as image_book, transactions.created_at,transactions.updated_at,transactions.id_buyer,user.name as name, transactions.id_seller,books.price, transactions.status FROM transactions INNER JOIN books ON books.id = transactions.id_book INNER JOIN user ON transactions.id_buyer = user.id WHERE transactions.id_buyer = ? ORDER BY status ASC, created_at DESC `,
            id,
            function (err, result) {
              if (!err) {
                resolve(result);
              } else {
                reject(new Error(err));
              }
            }
          );
        });
      },
      getTransactionsById: function (id) {
        return new Promise(function (resolve, reject) {
          connection.query(
            `SELECT transactions.id, transactions.id_book,books.title, books.image as image_book, transactions.created_at,transactions.updated_at,transactions.id_buyer,user.name as name, transactions.id_seller,books.price, transactions.status FROM transactions INNER JOIN books ON books.id = transactions.id_book INNER JOIN user ON transactions.id_buyer = user.id WHERE transactions.id = ? ORDER BY status ASC, created_at DESC `,
            id,
            function (err, result) {
              if (!err) {
                resolve(result);
              } else {
                reject(new Error(err));
              }
            }
          );
        });
      },
      getCountTransactionsUser: function (id) {
        return new Promise(function (resolve, reject) {
          connection.query(
            `SELECT COUNT(*) as count FROM transactions WHERE transactions.id_buyer = ?` ,id,
            function (err, result) {
              if (!err) {
                resolve(result);
              } else {
                reject(new Error(err));
              }
            }
          );
        });
      },
    postTransaction: function (id_buyer,id_book,id_seller) {
        return new Promise (function(resolve,reject){
            connection.query('INSERT INTO transactions SET id_buyer=? ,id_book=? , id_seller=?',[id_buyer, id_book, id_seller],function(error,result){
                if(!error){
                    const newData = {
                        id: result.insertId,
                        // result
                    }
                    resolve(newData)
                }else{
                    reject(new Error(error))
                }
            })
        })
    },
    putTransactionStatus: function (setData,id){
        return new Promise (function(resolve,reject){
            connection.query('UPDATE transactions SET status = ? WHERE id = ?',[setData,id],function(error,result){
                if(!error){
                    const newData ={
                        id:id,
                        ...setData
                    }
                    resolve(newData)
                } else{
                    reject(new Error(error))
                }
            })
        })
    },
    deletefileBook: function(image,file) {
        return new Promise(function(resolve, reject) {
            if(image!==''){
            fs.unlink('./public/image/' + image, function(err) {
                if (err) return reject(new Error(err))
                resolve(console.log('File delete succesfully'))
            })
        }
            if(file!==''){
            fs.unlink('./public/ebook/' + file, function(err) {
                if (err) return reject(new Error(err))
                resolve(console.log('File delete succesfully'))
            })
        }
        })

    },
    deleteTransaction: function(id){
        return new Promise(function(resolve, reject) {
            connection.query('DELETE from transactions WHERE id = ?', id, function(error, result) {
                if (!error) {
                    const newData = {
                        id: id,
                        //array spread
                    }
                    resolve(newData)
                } else {
                    reject(new Error(error))
                }
            })
        })
    },
    // getBookById: function(id) {
    //     return new Promise(function(resolve, reject) {

    //         connection.query('SELECT * from books where id= ?', id, function(error, result) {
    //             if (!error) {
    //                 resolve(result)
    //             } else {
    //                 reject(new Error(error))
    //             }
    //         })
    //     })
    // },
}