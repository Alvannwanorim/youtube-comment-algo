const Profile = require("../models/ProfileModels");
const User = require("../models/userModels");

//@desc CREATE USER PROFILE
//@route POST: /api/users/profile/
//access Private

exports.createProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const exitingUser = await User.findById(userId);
    if (!exitingUser) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    const { desc, coverPicture, town, city, relationship } = req.body;

    const userProfile = new Profile({
      user: existingUser._id,
      coverPicture,
      desc,
      town,
      city,
      relationship,
    });

    await userProfile.save();

    res.status(201).json({
      statusCode: 201,
      user: userProfile,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};

//@desc GET USER PROFILE
//@route GET: /api/users/profile/
//access Private
exports.getUserProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(200).json({
        statusCode: 200,
        user: profile,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};

//@desc UPDATE USER PROFILE
//@route PUT: /api/users/profile/
//access Private
exports.updateProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const userProfile = await Profile.findOne({ user: userId });

    if (!userProfile) {
      return res.status(404).json({
        statusCode: 404,
        message: "User Profile not found",
      });
    }

    userProfile.coverPicture =
      req.body.coverPicture || userProfile.coverPicture;
    userProfile.desc = req.body.desc || userProfile.desc;
    userProfile.city = req.body.city || userProfile.city;
    userProfile.town = req.body.town || userProfile.town;
    userProfile.relationship =
      req.body.relationship || userProfile.relationship;

    const userProfile = await user.save();

    res.status(201).json({
      statusCode: 201,
      user: userProfile,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};

exports.followUser = async (req, res) => {
  const userId = req.user.id;

  try {
    // get user wiht follow request
    const requestToFollow = await Profile.findOne({ user: userId });

    //return eror if user is not found
    if (!requestToFollow) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    //get user to be followed
    const userToFollow = await Profile.findOne({ user: req.params.id });

    ///return error message if user is not found
    if (!userToFollow) {
      return res.status(404).json({
        statusCode: 404,
        message: "The User You are requesting to follow does not exist",
      });
    }

    //check if request user if the same as theuser to be followed
    if (userId === userToFollow.user.toString()) {
      return res.status(400).json({
        statusCode: 400,
        message: "You can not follow yourself",
      });
    }
    //check if user is already being followed by request user
    const followedByUser = userToFollow.followers.find(
      (follower) => follower.user.toString() === userId
    );

    //return error message is user is already followed
    if (followedByUser) {
      return res.status(400).json({
        statusCode: 400,
        message: "You are already following this user",
      });
    }

    userToFollow.followers.push(userId);
    requestToFollow.followings.push(req.params.id);

    await userToFollow.save();
    await requestToFollow.save();

    res.status(200).json({
      statusCode: 200,
      message: "User followed successfully",
    });

    //check and return server error
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};

exports.unFollowUser = async (req, res) => {
  const userId = req.user.id;

  try {
    // get user wiht follow request
    const requestToUnFollow = await Profile.findOne(userId);

    //return eror if user is not found
    if (!requestToUnFollow) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    //get user to be followed
    const userToUnFollow = await Profile.findOne(req.params.id);

    ///return error message if ur is not found
    if (!userToUnFollow) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    //check if request user if the same as theuser to be followed
    if (userId === userToUnFollow._id.toString()) {
      return res.status(400).json({
        statusCode: 400,
        message: "You can not follow or unfollow yourself",
      });
    }
    //check if user is already being followed by request user
    const followedByUser = userToUnFollow.followers.find(
      (follower) => follower.user.toString() === userId
    );

    //return error message is user is already followed
    if (!followedByUser) {
      return res.status(400).json({
        statusCode: 400,
        message: "You are not following this user",
      });
    }
    const removeFollower = userToUnFollow.followers
      .map((follower) => follower.user.toString())
      .indexOf(userId);

    userToUnFollow.followers.splice(removeFollower, 1);

    const removeFollowing = requestToUnFollow.followers
      .map((user) => user.toString())
      .indexOf(userId);

    requestToUnFollow.following.splice(removeFollowing, 1);

    await userToUnFollow.save();
    await requestToUnFollow.save();

    res.status(200).json({
      statusCode: 200,
      message: "User unfollowed successfully",
    });

    //check and return server error
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};