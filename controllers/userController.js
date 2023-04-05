// Register User
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
// const Token = require("../models/tokenModel");
const jwt = require("jsonwebtoken");

// Generate Token with id
//use token in dotenv file
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  //check pw length
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters");
  }

  //check if email already exist
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered.");
  }

  //remember to hash password before create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  //   Generate Token
  const token = generateToken(user._id);

  //send http-only cookie
  res.cookie("token", token, {
    path: "/", //cookie will be accessible from any page on the website.
    httpOnly: true, //flags the cookie to be only used by the web server.
    expires: new Date(Date.now() + 1000 * 86400), //1 day
    sameSite: "none", //enables cross-site cookie sharing. frontend and backend on dif URL
    secure: false,
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data.");
  }
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //validate request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
  }
  //check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found, please sign up!");
  }
  //user exists, check if pw is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  //   Generate Token
  const token = generateToken(user._id);

  //send http-only cookie
  if (passwordIsCorrect) {
    res.cookie("token", token, {
      path: "/", //cookie will be accessible from any page on the website.
      httpOnly: true, //flags the cookie to be only used by the web server.
      expires: new Date(Date.now() + 1000 * 86400), //1 day
      sameSite: "none", //enables cross-site cookie sharing. frontend and backend on dif URL
      secure: false,
    });
  }

  if (user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

// Logout User
//set value of cookie to empty string and expire it immediately
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), //expire the cookie
    sameSite: "none",
    secure: false,
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
});

// Get User Data
//i.e. profile page in frontend
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

//get login status, return boolean
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  //has token Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

//update user profile
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, photo, phone, bio } = user;
    user.email = email; //user can not change email
    user.name = req.body.name || name; //if user change name update it, else keep current name
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

//update user profile
const changePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    //expect two input oldPw, pw
    const {oldPassword, password} = req.body

    if (!user){
        res.status(404);
        throw new Error("User Not Found, please sign up");
    }
    //validate two inputs
    if (!oldPassword || !password){
        res.status(404);
        throw new Error("Please add old and new pw");
    }
    //check if old password matches password in DB
    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password)
    //if user exist and pw correct
    if (user && passwordIsCorrect){
        user.password = password
        await user.save()
        res.status(200).send("password change successful")
    } else {
        res.status(400);
        throw new Error("password incorrect");
    }
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
};
