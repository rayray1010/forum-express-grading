const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },

    async (req, username, password, cb) => {
      const user = await User.findOne({ where: { email: username } })
      if (!user)
        return cb(
          null,
          false,
          req.flash('error_messages', '帳號或密碼輸入錯誤')
        )
      if (!bcrypt.compareSync(password, user.password)) {
        return cb(
          null,
          false,
          req.flash('error_messages', '帳號或密碼輸入錯誤！')
        )
      }
      return cb(null, user)
    }
  )
)

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
  let user = await User.findByPk(id)
  user = user.toJSON()
  return cb(null, user)
})

module.exports = passport
