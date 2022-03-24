const express = require("express");
const router = express.Router();
const Controller = require("../controllers");

router.get("/", Controller.home)

router.get("/register", Controller.registerFormGet)

router.post("/register", Controller.registerFormPost)

router.get("/login", Controller.loginPageGet)

router.post("/login", Controller.loginPagePost)

module.exports = router