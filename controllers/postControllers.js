const Post = require("../models/postModels");
const User = require("../models/userModels");
const Comment = require("../models/commentModels");

//@desc: CREATE POSTS
//@route POST: /api/posts/
//@access Private
exports.createNewPost = async (req, res) => {
  const { description, image, video } = req.body;
  const user_id = req.user.id;
  try {
    if (!description || !image || !video) {
      return res.status(400).json({
        message: "Your Post body is empty",
      });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        message: "Only logged in users can create posts",
      });
    }
    const post = {};
    if (description) post.description = description;
    if (image) post.image = image;
    if (video) post.video = video;
    post.comments = 0;
    post.user = user_id;
    const newPost = new Post(post);

    await newPost.save();

    res.status(200).json({
      post: newPost,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};

//@desc: GET POSTS
//@route GET: /api/posts/
//@access Private
exports.getPost = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};

//@desc: GET POSTS BY ID
//@route GET: /api/posts/:post_id
//@access Private
exports.getPostById = async (req, res) => {
  const post_id = req.params.post_id;

  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};

//@desc: LIKE POST
//@route PUT: /api/posts/:post_id/likes
//@access Private
exports.getPostById = async (req, res) => {
  const post_id = req.params.post_id;
  const user_id = req.user.id;

  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const likedPost = post.likes.find((like) => like.user === user_id);
    if (likedPost) return;
    post.likes.push(user_id);

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};
