const express = require("express");
const { check } = require("express-validator");
const {
  registerUser,
  loginUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/usercontrollers");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.post(
  "/register",
  [
    check("email", "email is requrired ").isEmail(),
    check("username", "Please supply the username").not().isEmpty(),
    check("password", "Password with minimum of six characters is required")
      .exists()
      .isLength({ min: 6 }),
  ],
  registerUser
);

//Login User route
router.post(
  "/login",
  [
    check("password", "Password with minimum of six characters is required")
      .exists()
      .isLength({ min: 6 }),
    check("email", "email is required").not().isEmpty(),
  ],
  loginUser
);

//get logged in user route
router.get("/", auth, getUser);

//Get any user
router.get("/:id", auth, getUserById);

//update user
router.put("/:id", auth, updateUser);

//delete User
router.delete("/:id", auth, deleteUser);

module.exports = router;
