const connection = require('../config/mysql');

module.exports = {
  getRatingByIdBook: function (id) {
    return new Promise(function (resolve, reject) {
      connection.query("SELECT * FROM rating WHERE id_book= ?",id, function (err, result) {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
  getAllRating: function () {
    return new Promise(function (resolve, reject) {
      connection.query("SELECT * FROM rating", function (err, result) {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
  postRating: function (setData) {
    return new Promise(function (resolve, reject) {
      connection.query("INSERT INTO rating SET ?", setData, function (
        err,
        result
      ) {
        if (!err) {
          const newData = {
            id: result.insertId,
            ...setData,
          };
          resolve(newData);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
};
