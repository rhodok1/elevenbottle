const { Order, Product, User } = require('../models');

class Controller {
    static home(req, res) {
        res.render("home")
    }
    static registerForm(req, res) {
        res.render("register")
    }
    static register(req, res) {
        const {email, password, role} = req.body
        const newUser = {
            email,
            password,
            role,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        User.create(newUser)
        .then(() => {
            res.redirect("/login")
        })
        .catch((err) => {
            res.send(err)
        })

    }
}

module.exports = Controller