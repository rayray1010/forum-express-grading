const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: async (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不相同！')
      return res.redirect('/signup')
    } else {
      try {
        const user = await User.findOne({ where: { email: req.body.email } })
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        }
      } catch (err) {
        console.log(err)
      }
    }
    try {
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10),
          null
        ),
      })
      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (err) {
      console.log(err)
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: async (req, res) => {
    const user = await User.findByPk(req.params.id)
    return res.render('profile', { user: user.toJSON() })
  },
  editUser: async (req, res) => {
    const user = await User.findByPk(req.params.id)
    return res.render('edit', { user: user.toJSON() })
  },
  putUser: async (req, res) => {
    const user = await User.findByPk(req.params.id)
    if (!req.body.name || !req.body.email) {
      req.flash('error_messages', '名字不能空白！')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, async (err, img) => {
        user.update({ ...req.body, image: file ? img.data.link : null })
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${req.user.id}`)
      })
    } else {
      await user.update({ name: req.body.name, email: req.body.email })
      req.flash('success_messages', '使用者資料編輯成功')
      return res.redirect(`/users/${req.params.id}`)
    }
  },
}

module.exports = userController
