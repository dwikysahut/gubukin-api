const connection = require("../config/mysql");

const fs = require("fs");

module.exports = {
  getUser: function () {
    return new Promise(function (resolve, reject) {
      connection.query("SELECT * from user", function (error, result) {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error));
        }
      });
    });
  },
  getUserById: function (id) {
    return new Promise(function (resolve, reject) {
      connection.query("SELECT * from user WHERE id=?", id, function (
        error,
        result
      ) {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error));
        }
      });
    });
  },
  postUser: function (setData) {
    return new Promise(function (resolve, reject) {
      connection.query("INSERT INTO user SET ?", setData, function (
        error,
        result
      ) {
        if (!error) {
          const newData = {
            id: result.insertId,
            ...setData,
            result,
          };
          resolve(newData);
        } else {
          reject(new Error(error));
        }
      });
    });
  },
  putUser: function (setData, id) {
    return new Promise(function (resolve, reject) {
      connection.query(
        "UPDATE user SET ? WHERE id = ?",
        [setData, id],
        function (error, result) {
          if (!error) {
            const newData = {
              id: id,
              ...setData,
            };
            delete newData.password;
            resolve(newData);
          } else {
            reject(new Error(error));
          }
        }
      );
    });
  },
  deleteImageUser: function (image) {
    return new Promise(function (resolve, reject) {
      fs.unlink("./public/imageProfile/" + image, function (err) {
        if (err) return reject(new Error(err));
        resolve(console.log("File delete succesfully"));
      });
    });
  },
  deleteUser: function (id) {
    return new Promise(function (resolve, reject) {
      connection.query("DELETE from user WHERE id = ?", id, function (
        error,
        result
      ) {
        if (!error) {
          const newData = {
            id: id,
            //array spread
          };
          resolve(newData);
        } else {
          reject(new Error(error));
        }
      });
    });
  },
  getUserByIdManage: function (id) {
    return new Promise(function (resolve, reject) {
      connection.query("SELECT * from user where id= ?", id, function (
        error,
        result
      ) {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error));
        }
      });
    });
  },
};
