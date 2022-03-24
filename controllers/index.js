const { Order, Product, User, ProductDetail, Category } = require("../models");
const bcrypt = require("bcryptjs");
const formatDate = require("../helpers");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "emaildummyjiwo@gmail.com",
    pass: "a1a1a1__",
  },
});

class Controller {
  static home(req, res) {
    Product.findAll({
      order: [["price", "ASC"]],
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
        let mailOptions = {
          from: "emaildummyjiwo@gmail.com",
          to: email,
          subject: "Welcome to Eleven Bottles!",
          text: "Thank you for registering!",
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
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
    let products = null;
    let ordersUsersProducts = null;
    Product.findAll({
      order: [["price", "ASC"]],
      include: ["ProductDetail", "Category"],
    })
      .then((data) => {
        products = data;
        return Order.findAll({
          order: [["id", "ASC"]],
          include: ["User", "Product"],
        });
      })
      .then((data) => {
        ordersUsersProducts = data;
      })
      .then(() => {
        res.render("admin", { products, ordersUsersProducts, formatDate });
      });
  }

  static approve(req, res) {
    const { orderId } = req.params;
    let orderData = null;
    Order.findByPk(+orderId)
      .then((data) => {
        orderData = data;
        return Order.update(
          {
            status: "approved",
          },
          {
            where: {
              id: orderId,
            },
          }
        );
      })
      .then(() => {
        return Product.findByPk(orderData.ProductId);
      })
      .then((product) => {
        Product.update(
          {
            stock: product.stock - orderData.quantity,
          },
          {
            where: {
              id: product.id,
            },
          }
        );
      })
      .then(() => {
        res.redirect("/admin");
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static reject(req, res) {
    const { orderId } = req.params;
    Order.findByPk(+orderId)
      .then(() => {
        return Order.update(
          {
            status: "rejected",
          },
          {
            where: {
              id: orderId,
            },
          }
        );
      })
      .then(() => {
        res.redirect("/admin");
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static user(req, res) {
    let products = null;
    Product.findAll({
      order: [["price", "ASC"]],
      exclude: ["createdAt", "updatedAt", "description", "CategoryId"],
    })
      .then((data) => {
        products = data;
        return Order.findAll({
          where: {
            UserId: req.session.user.id,
          },
          include: Product,
          order: [["status", "ASC"]],
        });
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
    const { productId } = req.params;
    const { shippingAddress, quantity } = req.body;
    Product.findByPk(+productId, {
      attributes: ["price"],
    })
      .then((product) => {
        const newOrder = {
          shippingAddress,
          quantity: +quantity,
          totalPrice: product.price * +quantity,
          UserId: req.session.user.id,
          ProductId: +productId,
        };
        return Order.create(newOrder);
      })
      .then(() => {
        res.redirect("/user");
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

  static addProductForm(req, res) {
    res.render("addProduct");
  }

  static addProduct(req, res) {
    console.log(req.body);
    const { name, stock, price, description, CategoryId } = req.body;
    const newProduct = {
      name,
      stock,
      price,
      CategoryId,
    };
    Product.create(newProduct)
      .then((product) => {
        const newProductDetail = {
          description,
          ProductId: product.id,
        };
        ProductDetail.create(newProductDetail);
      })
      .then(() => {
        res.redirect("/admin");
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static editProductForm(req, res) {
    const { productId } = req.params;
    Product.findOne({
      where: {
        id: productId,
      },
      include: ProductDetail,
    })
      .then((product) => {
        res.render("editProduct", { product });
      })
      .catch((err) => res.send(err));
  }

  static editProduct(req, res) {
    const { productId } = req.params;
    const { name, stock, price, description, CategoryId } = req.body;

    Product.update(
      {
        name,
        stock,
        price,
        CategoryId,
      },
      {
        where: {
          id: productId,
        },
      }
    )
      .then((product) => {
        ProductDetail.update(
          { description },
          {
            where: {
              id: productId,
            },
          }
        );
      })
      .then(() => {
        res.redirect("/admin");
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static delete(req, res) {
    const { productId } = req.params;
    Product.destroy({
      where: {
        id: productId,
      },
    })
      .then(() => {
        res.redirect("/admin");
      })
      .catch((err) => res.send(err));
  }

  static logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/");
    });
  }
}

module.exports = Controller;
