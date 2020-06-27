const connection = require("../config/mysql");

const fs = require("fs");

module.exports = {
  getCountBooks: function (status, price, search) {
    return new Promise(function (resolve, reject) {
      connection.query(
        `SELECT COUNT(*) FROM books INNER JOIN user ON books.id_user = user.id WHERE (books.status LIKE "${status}") AND (books.price ${price} 0) AND (books.title LIKE "${search}" OR books.author LIKE "${search}")`,
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
  getBooks: function (status, price, search, value, sort, start, limit) {
    return new Promise(function (resolve, reject) {
      connection.query(
        `SELECT books.id, books.title, books.description, books.category, books.author, books.image, books.file_ebook, books.id_user, user.name as user, books.price, books.status, books.rating, books.created_at, books.updated_at FROM books INNER JOIN user ON books.id_user = user.id WHERE (books.status LIKE "${status}") AND (books.price ${price} 0) AND (books.title LIKE "${search}" OR books.author LIKE "${search}") ORDER BY ${value} ${sort} LIMIT ${start}, ${limit}`,
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
  getCountBooksByUser: function (idUser) {
    return new Promise(function (resolve, reject) {
      connection.query(
        `SELECT COUNT(*) FROM books INNER JOIN user ON books.id_user = user.id WHERE user.id=${idUser}`,
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
  getBooksByUser: function (idUser, value, sort, start, limit) {
    return new Promise(function (resolve, reject) {
      connection.query(
        `SELECT books.id, books.title, books.description, books.category, books.author, books.image, books.file_ebook, books.id_user, user.name as user, books.price, books.status, books.rating,books.limit_file, books.created_at, books.updated_at FROM books INNER JOIN user ON books.id_user = user.id WHERE user.id=${idUser} ORDER BY ${value} ${sort} LIMIT ${start}, ${limit}`,
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
  getDataBookByUser: function (idUser) {
    return new Promise(function (resolve, reject) {
      connection.query(
        `SELECT * FROM books  WHERE books.id_user=${idUser}`,
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
  postBook: function (setData) {
    return new Promise(function (resolve, reject) {
      connection.query("INSERT INTO books SET ?", setData, function (
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
  putBook: function (setData, id) {
    return new Promise(function (resolve, reject) {
      connection.query(
        "UPDATE books SET ? WHERE id = ?",
        [setData, id],
        function (error, result) {
          if (!error) {
            const newData = {
              id: id,
              ...setData,
            };
            resolve(newData);
          } else {
            reject(new Error(error));
          }
        }
      );
    });
  },
  deletefileBook: function (image, file) {
    return new Promise(function (resolve, reject) {
      if (image !== "") {
        fs.unlink("./public/image/" + image, function (err) {
          if (err) return reject(new Error(err));
          resolve(console.log("File delete succesfully"));
        });
      }
      if (file !== "") {
        fs.unlink("./public/ebook/" + file, function (err) {
          if (err) return reject(new Error(err));
          resolve(console.log("File delete succesfully"));
        });
      }
    });
  },
  deleteBook: function (id) {
    return new Promise(function (resolve, reject) {
      connection.query("DELETE from books WHERE id = ?", id, function (
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
  getBookById: function (id) {
    return new Promise(function (resolve, reject) {
      connection.query("SELECT * from books where id= ?", id, function (
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
