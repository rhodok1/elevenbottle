const express = require("express");
const Controller = require("../controllers");
const router = express.Router();

router.get("/", Controller.home)
router.get("/register", Controller.registerForm)
router.post("/register", Controller.register)
router.get("/login", Controller.home)
router.post("/login", Controller.home)

module.exports = router