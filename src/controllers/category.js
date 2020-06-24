const categoryModel = require("../models/category");
const helper = require("../helpers");

module.exports = {
  getCategory: async function (req, res) {
    try {
      const result = await categoryModel.getCategory();

      return helper.response(res, 200, result);
    } catch (error) {
      return helper.response(res, 500, error);
    }
  },
  postCategory: async function (req, res) {
    try {
      const setData = req.body;

      const result = await categoryModel.postCategory(setData);
      return helper.response(res, 200, result);
    } catch (error) {
      return helper.response(res, 500, error);
    }
  },
  putCategory: async function (req, res) {
    try {
      const setData = req.body;
      const id = req.params.id;

      const result = await categoryModel.putCategory(setData, id);

      return helper.response(res, 200, result);
    } catch (error) {
      return helper.response(res, 500, error);
    }
  },
  deleteCategory: async function (req, res) {
    try {
      const id = req.params.id;
      const result = await categoryModel.deleteCategory(id);

      return helper.response(res, 200, result);
    } catch (error) {
      return helper.response(res, 500, error);
    }
  },
};
