const userModels = require("../models/user");
const helper = require("../helpers");
const bcrypt = require("bcrypt");

module.exports = {
  getUser: async function (request, response) {
    try {
      console.log(process.env.DB_HOST);
      const result = await userModels.getUser();
      return helper.response(response, 200, result);
    } catch (error) {
      console.log(error);
      return helper.response(response, 500, error);
    }
  },
  getUserById: async function (request, response) {
    try {
      const id = request.params.id;
      const result = await userModels.getUserById(id);
      return helper.response(response, 200, result);
    } catch (error) {
      console.log(error);
      return helper.response(response, 500, error);
    }
  },
  postUser: async function (request, response) {
    try {
      const setData = request.body;
      setData.image_profile = request.files["image_profile"][0].filename;
      // setData.file_ebook=request.files['file_ebook'][0].filename
      const result = await userModels.postUser(setData);
      return helper.response(response, 200, { result });
    } catch (error) {
      console.log(error);
      return helper.response(response, 500, { message: error.name });
    }
  },
  putUser: async function (request, response) {
    try {
      const setData = request.body;
      if (request.files["image_profile"]) {
        setData.image_profile = request.files["image_profile"][0].filename;
      }

      // setData.image = request.files['image'][0].filename
      // setData.file_ebook=request.files['file_ebook'][0].filename
      if (request.body.password) {
        const password = setData.password;
        const hash = bcrypt.hashSync(password, 18);
        setData.password = hash;
      }

      const id = request.params.id;
      const user = await userModels.getUserByIdManage(id);
      if (request.files["image_profile"] && user[0].image_profile) {
        try {
          await userModels.deleteImageUser(user[0].image_profile);
        } catch (error) {
          console.log("no file deleted");
        }
      }

      const result = await userModels.putUser(setData, id);

      return helper.response(response, 200, result);
    } catch (error) {
      console.log(error);
      return helper.response(response, 500, error);
    }
  },
  deleteUser: async function (request, response) {
    try {
      const id = request.params.id;
      const user = await userModels.getUserByIdManage(id);
      await userModels.deleteImageUser(user[0].image_profile);

      const result = await userModels.deleteUser(id);

      return helper.response(response, 200, result);
    } catch (error) {
      console.log(error);
      return helper.response(response, 500, error);
    }
  },
};
