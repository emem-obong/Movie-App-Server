// register

const User = require("../models/user");
const bcrypt = require("bcrypt");
const customError = require("../utils/customError");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  const { email, password, repeatPassword } = req.body;
  if (!email) {
    return next(customError("please provide an Email", 400));

    // return res.status(400).json({
    //   message: "please provide an Email",
    // });
  }
  if (!password) {
    return next(customError("Please Provide a Password", 400));
    // return res.status(400).json({
    //   message: "please provide a Password",
    // });
  }

  if (password !== repeatPassword) {
    return next(customError("Password Mismatch", 400));
    // res.status(400).json({
    //   message: "Password Mismatch",
    // });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create the user on the DataBase

  try {
    const user = await User.create({ email, password: hashedPassword });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    return res.status(200).json({ id: user._id, token });
  } catch (error) {
    if (error.code === 11000 && error.keyValue.email) {
      return next(customError("Email Already Exists ", 400));
    }
    if (error.errors.email.message) {
      return next(customError(error.errors.email.message, 400));
    }

    next(customError("Something went wrong", 500));
  }
};

// login
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(customError("Please Provide an Email ", 400));
  }
  if (!password) {
    return next(customError("Please Provide a Password", 400));
  }
  const user = await User.findOne({ email });

  if (!user) {
    return next(customError("User does not exist", 400));
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return next(customError("Wrong Password", 401));
  }

  // generate a token for the User

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.status(200).json({
    token,
    id: user._id,
  });
};
const getUser = (req, res) => {
  const { userId } = req.user;

  // receive token and decode the information on the token

  res.status(200).json({id: userId});
};

module.exports = { register, login, getUser };
