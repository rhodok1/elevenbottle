const { Order, Product, User, ProductDetail, Category } = require("../models");
const bcrypt = require("bcryptjs");
const formatDate = require('../helpers');

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
              return res.redirect(`/user`);
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
		let products = null
    Product.findAll({
      exclude: ["createdAt", "updatedAt", "description", "CategoryId"],
    })
      .then((data) => {
				products = data
				return Order.findAll({
					where: {
						UserId: req.session.user.id
					},
					include: Product
				})
      })
			.then((orders) => {
				res.render("user", { products, orders, formatDate });
			})
      .catch((err) => {
        res.send(err);
      });
  }

  static userProductDetails(req, res) {
    const { userId, productId } = req.params;
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
        res.render("userproductdetails", { product, userId });
      })
      .catch((err) => {
        res.send(err);
      });
  }

	static userBuyPost(req, res) {
		const { productId }	 = req.params
		const { shippingAddress, quantity } = req.body
		Product.findByPk(+productId, {
			attributes: ['price']
		})
			.then((product) => {
				const newOrder = {
					shippingAddress,
					quantity: +quantity,
					totalPrice: product.price * +quantity,
					UserId: req.session.user.id,
					ProductId: +productId
				}
				return Order.create(newOrder)
			})
			.then(() => {
				res.redirect('/user');
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

  static logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/");
    });
  }
}

module.exports = Controller;
