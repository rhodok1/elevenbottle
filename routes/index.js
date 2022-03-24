const express = require("express");
const router = express.Router();
const Controller = require("../controllers");

router.get("/", Controller.home)
router.get("/register", Controller.registerForm)
router.post("/register", Controller.register)
router.get("/login", Controller.home)
router.post("/login", Controller.home)


module.exports = router