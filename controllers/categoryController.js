const db = require('../models')
const Category = db.Category
const categoryService = require('../Services/categoryService')
const categoryController = {
  getCategories: async (req, res) => {
    categoryService.getCategories(req, res, data => {
      return res.render('admin/categories', data)
    })
  },
  postCategory: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_messages', "name didn't exist")
        return res.redirect('back')
      }
      await Category.create({ name: req.body.name })
      return res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
    }
  },
  putCategory: async (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    try {
      const category = await Category.findByPk(req.params.id)
      await category.update(req.body)
      res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id)
      await category.destroy()
      res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = categoryController
