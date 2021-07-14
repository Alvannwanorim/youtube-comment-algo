const express = require("express");
const { check } = require("express-validator");
const {
  followUser,
  unFollowUser,
  createProfile,
  getUserProfile,
} = require("../controllers/profileControllers");

const { auth } = require("../middlewares/auth");
const router = express.Router();

//Create user profile
router.post("/", auth, createProfile);

// Get user profile
router.get("/profile", auth, getUserProfile);
router.put("/follow/:id", auth, followUser);

//unfollow user
router.put("/unfollow/:id", auth, unFollowUser);

module.exports = router;
