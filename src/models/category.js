const connection = require('../config/mysql');

module.exports = {
  getCategory: function () {
    return new Promise(function (resolve, reject) {
      connection.query("SELECT * FROM category", function (err, result) {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
  postCategory: function (setData) {
    return new Promise(function (resolve, reject) {
      connection.query("INSERT INTO category SET ?", setData, function (
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
  putCategory: function (setData, id) {
    return new Promise(function (resolve, reject) {
      connection.query(
        "UPDATE category SET ? WHERE id=?",
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
  deleteCategory: function (id) {
    return new Promise(function (resolve, reject) {
      connection.query("DELETE FROM category WHERE id=?", id, function (
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
