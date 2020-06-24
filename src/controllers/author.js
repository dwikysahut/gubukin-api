const authorModel = require("../models/author");
const helper = require("../helpers");

module.exports = {
  getAuthor: async function (req, res) {
    try {
      const result = await authorModel.getAuthor();

      return helper.response(res, 200, result);
    } catch (error) {
      return helper.response(res, 500, error);
    }
  },
  postAuthor: async function (req, res) {
    try {
      const setData = req.body;

      const result = await authorModel.postAuthor(setData);
      return helper.response(res, 200, result);
    } catch (error) {
      return helper.response(res, 500, error);
    }
  },
  putAuthor: async function (req, res) {
    try {
      const setData = req.body;
      const id = req.params.id;

      const result = await authorModel.putAuthor(setData, id);

      return helper.response(res, 200, result);
    } catch (error) {
      return helper.response(res, 500, error);
    }
  },
  deleteAuthor: async function (req, res) {
    try {
      const id = req.params.id;
      const result = await authorModel.deleteAuthor(id);

      return helper.response(res, 200, result);
    } catch (error) {
      return helper.response(res, 500, error);
    }
  },
};
