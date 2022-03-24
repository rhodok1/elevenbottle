const { Order, Product, User, ProductDetail, Category } = require("../models");
const bcrypt = require("bcryptjs");

class Controller {
  static home(req, res) {
    Product.findAll({
      exclude: ["createdAt", "updatedAt", "description", "CategoryId"],
    })
      .then((products) => {
        res.render("home", { products });
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static productDetails(req, res) {
    const { productId } = req.params;
    Product.findByPk(+productId, {
      include: [
        {
          model: ProductDetail,
          attributes: ["description"],
        },
        {
          model: Category,
          attributes: ["name"],
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    })
      .then((product) => {
        res.render("productdetails", { product });
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static registerFormGet(req, res) {
    res.render("register");
  }

  static registerFormPost(req, res) {
    const { email, password, role } = req.body;
    const newUser = {
      email,
      password,
      role,
    };
    User.create(newUser)
      .then(() => {
        res.redirect("/login");
      })
      .catch((err) => {
        if (err.name === "SequelizeValidationError") {
          const errors = err.errors.map((el) => el.message);
          res.send(errors);
        } else {
          res.send(err);
        }
      });
  }

  static loginPageGet(req, res) {
    const { error } = req.query;
    res.render("login", { error });
  }

  static loginPagePost(req, res) {
    const { email, password } = req.body;
    User.findOne({
      where: { email },
    })
      .then((user) => {
        if (user) {
          const isValidPassword = bcrypt.compareSync(password, user.password);
          if (isValidPassword) {
            req.session.user = {
              id: user.id,
              role: user.role,
            };
            if (user.role === "admin") {
              return res.redirect("/admin");
            } else {
              return res.redirect(`/user/${user.id}`);
            }
          } else {
            const error = "invalid username or password";
            return res.redirect(`/login?error=${error}`);
          }
        } else {
          const error = "invalid username or password";
          return res.redirect(`/login?error=${error}`);
        }
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static admin(req, res) {
    const { id } = req.params;
    Product.findAll({
      include: [ProductDetail, Category],
    }).then((data) => {
      res.render("admin", { data, id });
    });
  }

  static user(req, res) {
    const { id } = req.params;
    Product.findAll({
      include: [
        {
          model: ProductDetail,
          attributes: ["description", "id"],
        },
        {
          model: Category,
          attributes: ["name"],
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    }).then((data) => {
      res.render("user", { data, id });
    });
  }
  static logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/");
    });
  }

  static userBuyGet(req, res) {
    const { userId, productId } = req.params;
    Product.findByPk(+productId, {
      exclude: ["createdAt", "updatedAt"],
    })
      .then((product) => {
        res.render("buy", { userId, product });
      })
      .catch((err) => {
        if (err.name === "SequelizeValidationError") {
          const errors = err.errors.map((el) => el.message);
          res.send(errors);
        } else {
          res.send(err);
        }
      });
  }

  static userBuyPost(req, res) {}
}

module.exports = Controller;
