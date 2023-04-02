const express = require("express");
const router = express.Router();
const {registerUser} = require("../controllers/userController");

//frontend send info and post to backend using the controller
router.post("/register", registerUser);


module.exports = router;