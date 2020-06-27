const booksModels = require("../models/books");
const helper = require("../helpers");
const redisClient = require("../config/redis");
const userModels = require("../models/user");


module.exports = {
  getBooks: async function (req, res) {
    try {
      if (req.query.page === undefined || req.query.page === "") {
        req.query.page = 1;
      }

      if (req.query.limit === undefined || req.query.limit === "") {
        req.query.limit = 6;
      }
      if (req.query.sort === "true") {
        req.query.sort = "ASC";
      } else {
        req.query.sort = "DESC";
      }
      if (req.query.value === undefined || req.query.value === "") {
        req.query.value = "books.created_at";
      } else if (req.query.value === "title") {
        req.query.value = "books.title";
      } else if (req.query.value === "author") {
        req.query.value = "books.author";
      } else if (req.query.value === "random") {
        req.query.value = "RAND()";
      }
      if (req.query.search === undefined || req.query.search === "") {
        req.query.search = "";
      }
      if (req.query.price === undefined || req.query.price === "") {
        req.query.price = ">=";
      } else if (req.query.price === "free") {
        req.query.price = "=";
      } else if (req.query.price === "premium") {
        req.query.price = ">";
      }
      if (req.query.status === undefined || req.query.status === "") {
        req.query.status = "";
      }

      const value = req.query.value;
      const sort = req.query.sort;
      const limit = parseInt(req.query.limit);
      const start = (req.query.page - 1) * limit;
      const currentPage = parseInt(req.query.page);
      const next = parseInt(currentPage + 1);
      const previous = parseInt(currentPage - 1);
      const search = `%${req.query.search}%`;
      const status = `%${req.query.status}%`;
      const price = req.query.price;
      const data = await booksModels.getCountBooks(status, price, search);
      const result = await booksModels.getBooks(
        status,
        price,
        search,
        value,
        sort,
        start,
        limit
      );
      const totalData = data[0]["COUNT(*)"];
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        totalPage,
        totalData,
        currentPage,
        limit,
        next,
        previous,
      };

      console.log(helper.convertObjectToPlainText(req.query));
      redisClient.get(
        `getBooks:${helper.convertObjectToPlainText(req.query)}`,
        async function (error, data) {
          if (error) throw error;

          if (data) {
            const cache = JSON.parse(data);
            return helper.response(res, 200, cache, pagination);
          } else {
            const results = await booksModels.getBooks(
              status,
              price,
              search,
              value,
              sort,
              start,
              limit
            );
            const cached = JSON.stringify(results, null, 0);
            redisClient.setex(
              `getBooks:${helper.convertObjectToPlainText(req.query)}`,
              3600,
              cached,
              function (error, reply) {
                if (error) throw error;
                console.log(reply);
              }
            );
            return helper.response(res, 200, result, pagination);
          }
        }
      );
    } catch (error) {
      console.log(error);
      return helper.response(res, 500, error);
    }
  },
  getBooksByUser: async function (req, response) {
    try {
      if (req.query.page === undefined || req.query.page === "") {
        req.query.page = 1;
      }

      if (req.query.limit === undefined || req.query.limit === "") {
        req.query.limit = 6;
      }
      if (req.query.sort === "true") {
        req.query.sort = "ASC";
      } else {
        req.query.sort = "DESC";
      }
      if (req.query.value === undefined || req.query.value === "") {
        req.query.value = "books.created_at";
      } else if (req.query.value === "title") {
        req.query.value = "books.title";
      } else if (req.query.value === "author") {
        req.query.value = "books.author";
      } else if (req.query.value === "random") {
        req.query.value = "RAND()";
      }
      const idUser = req.params.idUser;
      const value = req.query.value;
      const sort = req.query.sort;
      const limit = parseInt(req.query.limit);
      const start = (req.query.page - 1) * limit;
      const currentPage = parseInt(req.query.page);
      const next = parseInt(currentPage + 1);
      const previous = parseInt(currentPage - 1);

      const data = await booksModels.getCountBooksByUser(idUser);
      const result = await booksModels.getBooksByUser(
        idUser,
        value,
        sort,
        start,
        limit
      );
      const totalData = data[0]["COUNT(*)"];
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        totalPage,
        totalData,
        currentPage,
        limit,
        next,
        previous,
      };

      const query = {
        idUser,
        ...req.query,
      };

      redisClient.get(
        `getBooksByUser:${helper.convertObjectToPlainText(query)}`,
        async function (error, data) {
          if (error) throw error;

          if (data) {
            const cache = JSON.parse(data);
            return helper.response(response, 200, cache, pagination);
          } else {
            const results = await booksModels.getBooksByUser(
              idUser,
              value,
              sort,
              start,
              limit
            );
            const cached = JSON.stringify(results, null, 0);
            redisClient.setex(
              `getBooksByUser:${helper.convertObjectToPlainText(query)}`,
              3600,
              cached,
              function (error, reply) {
                if (error) throw error;
                console.log(reply);
              }
            );
            return helper.response(response, 200, result, pagination);
          }
        }
      );

      // return helper.response(response, 200, result, pagination);
    } catch (error) {
      return helper.response(response, 500, { message: error.name });
    }
  },
  postBook: async function (request, response) {
    try {
      const setData = request.body;
      setData.image = request.files["image"][0].filename;
      
      let user_id = 0
      if (request.token.result.id === undefined) {
        user_id = request.token.result.result.id
      }
      else {
        user_id = request.token.result.id
      }
      setData.id_user=user_id;
      setData.file_ebook = request.files["file_ebook"][0].filename;
      setData.limit_file = request.files['file_ebook'][0].size;
      const bookByUser = await booksModels.getDataBookByUser(user_id);
      let totalFileSize = 0;
      for (let i = 0; i < bookByUser.length; i++) {
        totalFileSize += bookByUser[i]['limit_file'];
      }
     
      if(totalFileSize+setData.limit_file>10000000){
        console.log(totalFileSize+setData.limit_file)
        const book = await booksModels.getBookById(user_id);
        //delete file di local, karena tidak jadi post.
        await booksModels.deletefileBook(request.files["image"][0].filename, "");
        await booksModels.deletefileBook("", request.files["file_ebook"][0].filename);
        return helper.response(response, 401, { message:'Your account exceeds the limit' });
        // console.log(error);
      }
      else{
        //bentuk byte
        const total=totalFileSize+setData.limit_file;

        //konversi ke mb
        const sizeMb = (total / Math.pow(1024,2))
        // console.log(total / Math.pow(1024,2))
        console.log(sizeMb)
        await userModels.putUser({total_limit:sizeMb},user_id);
        const result = await booksModels.postBook(setData);
        return helper.response(response, 200, { result });
      }
    } catch (error) {
      console.log(error);
      return helper.response(response, 500, { message: error.name });
    }
  },
  putBook: async function (request, response) {
    try {
      const setData = request.body;
      const id = request.params.id;
      const book = await booksModels.getBookById(id);
      if (request.files["image"]) {
        setData.image = request.files["image"][0].filename;
        await booksModels.deletefileBook(book[0].image, "");
      }
      if (request.files["file_ebook"]) {
        setData.file_ebook = request.files["file_ebook"][0].filename;
        await booksModels.deletefileBook("", book[0].file_ebook);
      }
      const result = await booksModels.putBook(setData, id);
      return helper.response(response, 200, result);
    } catch (error) {
      console.log(error);
      return helper.response(response, 500, error);
    }
  },
  deleteBook: async function (request, response) {
    try {
      const id_book = request.params.id;
      const book = await booksModels.getBookById(id_book);
      let user_id = 0
      if (request.token.result.id === undefined) {
        user_id = request.token.result.result.id
      }
      else {
        user_id = request.token.result.id
      }
      const user = await userModels.getUserById(user_id);
      let updateTotalLimit= user[0].total_limit-book[0].limit_file
       await userModels.putUser({total_limit:updateTotalLimit},user_id);

      await booksModels.deletefileBook(book[0].image, book[0].file_ebook);

      const result = await booksModels.deleteBook(id_book);

      return helper.response(response, 200, result);
    } catch (error) {
      console.log(error);
      return helper.response(response, 500, error);
    }
  },
};
