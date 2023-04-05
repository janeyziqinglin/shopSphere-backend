const express = require("express");
const router = express.Router();
const {registerUser , loginUser} = require("../controllers/userController");


//frontend send info and post to backend using the controller
router.post("/register", registerUser);
router.post("/login", loginUser);


module.exports = router;