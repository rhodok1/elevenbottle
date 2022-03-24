const { Order, Product, User } = require('../models');
const bcrypt = require('bcryptjs');

class Controller {
  static home(req, res) {
    res.render("home")
  }

  static registerFormGet(req, res) {
    res.render("register")
  }

  static registerFormPost(req, res) {
    const { email, password, role } = req.body
    const newUser = {
      email,
      password,
      role
    }
    User.create(newUser)
      .then(() => {
        res.redirect("/login")
      })
      .catch((err) => {
        if (err.name === 'SequelizeValidationError') {
          const errors = err.errors.map(el => el.message)
          res.send(errors)
        } else {
          res.send(err)
        }
      })
  }

  static loginPageGet(req, res) {
    res.render("login")
  }

  static loginPagePost(req, res) {
    const { email, password } = req.body
    User.findOne({
      where: { email }
    })
      .then(user => {
        if (user) {
          const isValidPassword = bcrypt.compareSync(password, user.password)
          if (isValidPassword) {
            if (user.role === "admin") {
              return res.redirect(`/admin/${user.id}`)
            } else {
              return res.redirect(`/user/${user.id}`)
            }
          } else {
            const error = "invalid username or password"
            return res.redirect(`/login?error=${error}`)
          }
        }
			})
      .catch(err => {
        res.send(err)
     	})
  }

  static admin(req, res) {
    const { id } = req.params
    console.log(req.params);
  }

  static user(req, res) {
    const { id } = req.params
    console.log(req.params);
  }
}

module.exports = Controller