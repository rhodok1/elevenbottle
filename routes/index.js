const express = require("express");
const router = express.Router();
const Controller = require("../controllers");

router.get("/", Controller.home)
router.get("/register", Controller.registerForm)
router.post("/register", Controller.register)
router.get("/login", Controller.loginPage)
router.post("/login", Controller.login)
router.get("/admin/:id", Controller.admin)
router.get("/user/:id", Controller.user)

module.exports = router