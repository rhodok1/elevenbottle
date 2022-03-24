const { Order, Product, User } = require('../models');

class Controller {
    static home(req, res) {
        res.render("home")
    }
}

module.exports = Controller