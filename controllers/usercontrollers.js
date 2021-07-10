const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModels");
const { validationResult } = require("express-validator");

//@desc REGISTER USER
//@route POST: /api/users/auth/register
//access Public

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const result = validationResult();

  if (!result.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      message: result.array(),
    });
  }
  try {
    //check for existing user: email
    const existingUser = await User.findOne({ email });

    //return error if user already exists
    if (existingUser) {
      return res.status(400).json({
        statusCode: 400,
        message: "",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      statusCode: 201,
      user: {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};

//@desc LOGIN USER
//@route POST: /api/users/auth/login
//access Public

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if user exists
    const user = await User.findOne({ email });

    //if user does not exist
    if (!user) {
      return res.status(400).json({
        statusCode: 400,
        message: "User does not exist",
      });
    }
    //check for password validity
    const isMatch = await bcrypt.compare(password, user.password);

    //return error message for password miss-match
    if (!isMatch) {
      return res.status(400).json({
        statusCode: 400,
        message: "password is incorrect",
      });
    }

    const payload = {
      user: {
        id: user._id,
      },
    };

    const token = await jwt.sign(payload, process.env.TOKEN_KEY, {
      expiresIn: "1d",
    });

    res.status(200).json({
      statusCode: 200,
      user: {
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};

//@desc GET USER BY ID
//@route  GET: /api/users/auth/
//access Private

exports.getUser = async (req, res) => {
  const id = req.user.id;

  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(400).json({
        statusCode: 400,
        message: "User not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      user: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};

//@desc GET USER BY ID
//@route /api/users/auth/:id
//access Private

exports.getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      user: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};

//@desc GET USER BY ID
//@route PUT: /api/users/auth/:id
//access Private
exports.updateUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    if (userId !== user._id.toString()) {
      return res.status(403).json({
        statusCode: 400,
        message: "User not authorized",
      });
    }
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    const updatedUser = await user.save();

    res.status(201).json({
      statusCode: 201,
      user: {
        username: updatedUser.username,
        email: updatedUser.username,
        profilePicture: updatedUser.profilePicture,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};

const updatePassword = async (req, res) => {
  const id = req.user.id;
  try {
    const user = User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    if (id !== user._id.toString()) {
      return res.status(400).json({
        statusCode: 400,
        message: "User not authorized",
      });
    }

    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;

    await user.save();

    res.status(201).json({
      statusCode: 201,
      message: "Password updated",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.user.id;

  try {
    if (userId.toString !== req.params.id) {
      return res.status(403).json({
        statusCode: 403,
        message: "User not authorized",
      });
    }
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    if (userId !== user._id.toString()) {
      return res.status(403).json({
        statusCode: 403,
        message: "User not authorized",
      });
    }

    await user.remove();
    res.status(200).json({
      statusCode: 200,
      message: "User remove sucessfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};
