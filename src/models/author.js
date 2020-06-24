const connection = require('../config/mysql');

module.exports = {
  getAuthor: function () {
    return new Promise(function (resolve, reject) {
      connection.query("SELECT * FROM author", function (err, result) {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
  postAuthor: function (setData) {
    return new Promise(function (resolve, reject) {
      connection.query("INSERT INTO author SET ?", setData, function (
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
  putAuthor: function (setData, id) {
    return new Promise(function (resolve, reject) {
      connection.query(
        "UPDATE author SET ? WHERE id=?",
        [setData, id],
        function (err, result) {
          if (!err) {
            const newData = {
              id,
              ...setData,
            };
            resolve(newData);
          } else {
            reject(new Error(err));
          }
        }
      );
    });
  },
  deleteAuthor: function (id) {
    return new Promise(function (resolve, reject) {
      connection.query("DELETE FROM author WHERE id=?", id, function (
        err,
        result
      ) {
        if (!err) {
          const newData = {
            id,
          };
          resolve(newData);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
};
