const express = require("express");
const router = express.Router();
const Controller = require("../controllers");

router.get("/", Controller.home);

router.get("/register", Controller.registerFormGet);

router.post("/register", Controller.registerFormPost);

router.get("/login", Controller.loginPageGet);

router.post("/login", Controller.loginPagePost);

router.get("/admin/:id", Controller.admin);

router.get("/admin/:id/add/:productId", Controller.admin);

router.post("/admin/:id/add/:productId", Controller.admin);

router.get("/admin/:id/edit/:productId", Controller.admin);

router.post("/admin/:id/edit/:productId", Controller.admin);

router.get("/admin/:id/delete/:productId", Controller.admin);

router.get("/user/:id", Controller.user);

module.exports = router;
