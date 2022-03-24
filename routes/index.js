const express = require("express");
const router = express.Router();
const Controller = require("../controllers");

router.get("/", Controller.home);

router.get("/register", Controller.registerFormGet);

router.post("/register", Controller.registerFormPost);

router.get("/login", Controller.loginPageGet);

router.post("/login", Controller.loginPagePost);

router.get("/logout", Controller.logout)

router.use(function(req, res, next) {
    if(req.session.user) {
        next()
    } else {
        const error = "Please login first"
        res.redirect(`login?error=${error}`)
    }
})

  const authenticatedUser = (req, res, next) => {
      if(req.session.user.role === "user") {
          next()
      } else {
        const error = "You dont have access to this page"
        res.redirect(`/login?error=${error}`)
    }
}
  const authenticatedAdmin = (req, res, next) => {
    if(req.session.user.role === "admin") {
        next()
    } else {
      const error = "You are not a user"
      res.redirect(`/login?error=${error}`)
    }
}

router.get("/admin", authenticatedAdmin, Controller.admin);

router.get("/admin/addProduct/:productId", authenticatedAdmin, Controller.admin);

router.post("/admin/addProduct/:productId", authenticatedAdmin, Controller.admin);

router.get("/admin/editProduct/:productId", authenticatedAdmin, Controller.admin);

router.post("/admin/editProduct/:productId", authenticatedAdmin, Controller.admin);

router.get("/admin/deleteProduct/:productId", authenticatedAdmin, Controller.admin);

router.get("/user/:userId", authenticatedUser, Controller.user);

router.get('/user/:userId/product/:productId', Controller.userProductDetails)

router.post('/user/:userId/product/:productId/order', Controller.userBuyPost)

module.exports = router;
