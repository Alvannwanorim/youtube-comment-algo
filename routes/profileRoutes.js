const express = require("express");
const { check } = require("express-validator");
const {
  followUser,
  unFollowUser,
  createProfile,
} = require("../controllers/profileControllers");

const { auth } = require("../middlewares/auth");
const router = express.Router();

//Create user profile
route.post("/", auth, createProfile);

// Get user profile
router.get("/auth", getUserProfile);
router.put("/follow/:id", auth, followUser);

//unfollow user
router.put("/unfollow/:id", auth, unFollowUser);

module.exports = router;
