const Post = require("../models/postModels");
const User = require("../models/userModels");
const Comments = require("../models/commentsModel");

function getValue(arr, id) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]._id.toString() === id) {
      return arr[i];
    }
  }
}
//@desc: CREATE POSTS
//@route POST: /api/posts/
//@access Private
exports.createNewPost = async (req, res) => {
  const { text, image, video } = req.body;
  const user_id = req.user.id;
  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        message: "Only logged in users can create posts",
      });
    }
    const post = {};
    if (text) post.text = text;
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
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json({ posts: posts });
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
    const post = await Post.findById(post_id).populate("user", ["username"]);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json({ post: post });
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
exports.likePost = async (req, res) => {
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

    const dislikedPost = post.dislikes.find(
      (dislike) => dislike._id.toString() === user_id
    );
    if (dislikedPost) {
      const likeIndex = post.dislikes
        .map((dislike) => dislike._id.toString() === user_id)
        .indexOf(user_id);

      post.dislikes.splice(likeIndex, 1);

      post.likes.push(user_id);
      await post.save();
      return res.status(201).json(post);
    }

    const likedPost = post.likes.find(
      (like) => like._id.toString() === user_id
    );

    if (likedPost) {
      return res.status(400).json({
        message: "Post already liked by user",
      });
    }
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

//TODO: DISLIKE A POST
//@desc: DISLIKE POST
//@route PUT: /api/posts/:post_id/dislikes
//@access Private
exports.dislikePost = async (req, res) => {
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

    const likedPost = post.likes.find(
      (like) => like._id.toString() === user_id
    );
    if (likedPost) {
      const likeIndex = post.likes
        .map((like) => like._id.toString() === user_id)
        .indexOf(user_id);

      post.like.splice(likeIndex, 1);

      post.dislikes.push(user_id);
      await post.save();
      return res.status(201).json(post);
    }

    const disLikedPost = post.dislikes.find(
      (like) => like._id.toString() === user_id
    );

    if (disLikedPost) {
      return res.status(400).json({
        message: "Post already disliked by user",
      });
    }
    post.dislikes.push(user_id);

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};

//@route PUT: /api/posts/:post_id/comment
//@access Private

exports.commentPost = async (req, res) => {
  const { text } = req.body;
  const newComment = {};
  newComment.text = text;
  newComment.user = req.user.id;
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userComments = await Comments.findOne({ post: req.params.post_id });
    if (userComments) {
      userComments.comments.push(newComment);
      await userComments.save();

      post.comments++;
      await post.save();
      return res.json({ Commnets: userComments });
    } else {
      const createdComment = new Comments({
        post: req.params.post_id,
        comments: newComment,
      });
      await createdComment.save();

      post.comments++;
      await post.save();
      res.status(201).json(createdComment);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};

//@desc: GET POST COMMENTS
//@route PUT: /api/posts/:post_id/comment
//@access Private
exports.getPostComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return re.status(404).json({
        message: "This post does not exist",
      });
    }
    const comments = await Comments.findOne({
      post: req.params.post_id,
    }).populate("user", ["username", "email"]);

    if (!comments) {
      return res
        .status(404)
        .json({ message: "No comments were found for this post" });
    }
    res.status(200).json({
      post: post,
      comments: comments,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};

//TODO: DELETE POST

//@desc: LIKE COMMENT
//@route PUT: /api/posts/:post_id/comment/:comment_id
//@access Private
exports.deletePost = async (req, res) => {
  const { post_id } = req.params;

  try {
    const post = Post.findById(post_id);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const postComments = Comments.findOne({ post: post_id });

    if (postComments) {
      await postComments.remove();
    }

    await post.remove();
    re.status(201).json({
      message: "Post and post comments removed suscessfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};

//@desc: LIKE COMMENT
//@route PUT: /api/posts/:post_id/comment/:comment_id
//@access Private
exports.likeComment = async (req, res) => {
  const { comment_id } = req.params;

  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return re.status(404).json({
        message: "This post does not exist",
      });
    }
    // console.log(req.params.comment_id);

    const postComments = await Comments.findOne({ post: req.params.post_id });
    if (!postComments) {
      return res
        .status(404)
        .json({ message: "No comments were found for this post" });
    }

    const { comments } = postComments;
    // console.log(comment_id);

    const userComment = getValue(comments, comment_id);

    // console.log(userComment);
    if (!userComment) {
      restart;
    }

    const dislikedPost = userComment.dislikes.find(
      (dislike) => dislike._id.toString() === user_id
    );
    if (dislikedPost) {
      const dislikeIndex = userComment.dislikes
        .map((dislike) => dislike._id.toString() === user_id)
        .indexOf(user_id);

      userComment.dislikes.splice(dislikeIndex, 1);

      userComment.likes.push(user_id);
      await postComments.save();
      return res.status(201).json(postComments);
    }
    const likedComment = userComment.likes.find(
      (like) => like._id.toString() === req.user.id
    );

    if (likedComment) {
      return res.status(400).json({
        message: "Comment already liked by User",
      });
    }
    userComment.likes.push(req.user.id);
    await postComments.save();
    res.status(200).json({
      message: "comment like successful",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};

//@desc: LIKE COMMENT
//@route PUT: /api/posts/:post_id/comment/:comment_id
//@access Private
exports.dislikeComment = async (req, res) => {
  const { comment_id } = req.params;

  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return re.status(404).json({
        message: "This post does not exist",
      });
    }
    // console.log(req.params.comment_id);

    const postComments = await Comments.findOne({ post: req.params.post_id });
    if (!postComments) {
      return res
        .status(404)
        .json({ message: "No comments were found for this post" });
    }

    const { comments } = postComments;
    // console.log(comment_id);

    const userComment = getValue(comments, comment_id);

    // console.log(userComment);
    if (!userComment) {
      restart;
    }

    const likedPost = userComment.likes.find(
      (like) => like._id.toString() === user_id
    );
    if (likedPost) {
      const likeIndex = userComment.likes
        .map((like) => like._id.toString() === user_id)
        .indexOf(user_id);

      userComment.likes.splice(likeIndex, 1);

      userComment.dislikes.push(user_id);
      await postComments.save();
      return res.status(201).json(postComments);
    }
    const dislikedComment = userComment.dislikes.find(
      (dislike) => dislike._id.toString() === req.user.id
    );

    if (dislikedComment) {
      return res.status(400).json({
        message: "Comment already disliked by User",
      });
    }
    userComment.dislikes.push(req.user.id);
    await postComments.save();
    res.status(200).json({
      message: "comment dislike successful",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};

//@desc: COMMENT ON COMMENT
//@route PUT: /api/posts/:post_id/comment/:comment_id/
//@access Private
exports.commentOnComment = async (req, res) => {
  const { comment_id } = req.params;
  const { post_id } = req.params;
  const { text } = req.body;
  const newComment = {};
  newComment.text = text;
  newComment.user = req.user.id;

  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return re.status(404).json({
        message: "This post does not exist",
      });
    }
    // console.log(req.params.comment_id);

    const postComments = await Comments.findOne({ post: post_id });
    if (!postComments) {
      return res
        .status(404)
        .json({ message: "No comments were found for this post" });
    }

    const { comments } = postComments;
    // console.log(comment_id);

    const userComment = getValue(comments, comment_id);

    // console.log(userComment);
    userComment.comment.unshift(newComment);

    await postComments.save();

    post.comments++;
    await post.save();
    res.status(200).json({
      comments: postComments,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};

//@desc: LIKE COMMENT ON COMMENT
//@route PUT: /api/posts/:post_id/comment/:comment_id/:single_id/like
//@access Private
exports.likeCommentonComment = async (req, res) => {
  const { comment_id } = req.params;
  const { post_id } = req.params;
  const { single_id } = req.params;

  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return re.status(404).json({
        message: "This post does not exist",
      });
    }
    // console.log(req.params.comment_id);

    const postComments = await Comments.findOne({ post: post_id });
    if (!postComments) {
      return res
        .status(404)
        .json({ message: "No comments were found for this post" });
    }

    const { comments } = postComments;
    // console.log(comment_id);

    const userComment = getValue(comments, comment_id);

    // console.log(userComment);
    const { comment } = userComment;

    const singleComment = comment.find(
      (single) => single._id.toString() === single_id
    );
    if (!singleComment) {
      return res.status(404).json({
        message: "This comment does not exist",
      });
    }

    const dislikedPost = singleComment.dislikes.find(
      (dislike) => dislike._id.toString() === user_id
    );
    if (dislikedPost) {
      const dislikeIndex = singleComment.dislikes
        .map((dislike) => dislike._id.toString() === user_id)
        .indexOf(user_id);

      singleComment.dislikes.splice(dislikeIndex, 1);

      singleComment.likes.push(user_id);
      await postComments.save();
      return res.status(201).json(postComments);
    }

    const likedComment = singleComment.likes.find(
      (like) => like._id.toString() === req.user.id
    );
    if (likedComment) {
      return res.status(400).json({
        message: "Comment already liked by user",
      });
    }
    singleComment.likes.push(req.user.id);

    await postComments.save();
    res.status(200).json({
      comments: postComments,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};
//@desc: DISLIKE COMMENT ON COMMENT
//@route PUT: /api/posts/:post_id/comment/:comment_id/:single_id/dislike
//@access Private
exports.dislikeCommentonComment = async (req, res) => {
  const { comment_id } = req.params;
  const { post_id } = req.params;
  const { single_id } = req.params;

  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return re.status(404).json({
        message: "This post does not exist",
      });
    }
    // console.log(req.params.comment_id);

    const postComments = await Comments.findOne({ post: post_id });
    if (!postComments) {
      return res
        .status(404)
        .json({ message: "No comments were found for this post" });
    }

    const { comments } = postComments;
    // console.log(comment_id);

    const userComment = getValue(comments, comment_id);

    // console.log(userComment);
    const { comment } = userComment;

    const singleComment = comment.find(
      (single) => single._id.toString() === single_id
    );
    if (!singleComment) {
      return res.status(404).json({
        message: "This comment does not exist",
      });
    }

    const likedPost = singleComment.likes.find(
      (like) => like._id.toString() === user_id
    );
    if (likedPost) {
      const likeIndex = singleComment.likes
        .map((like) => like._id.toString() === user_id)
        .indexOf(user_id);

      singleComment.likes.splice(likeIndex, 1);

      singleComment.dislikes.push(user_id);
      await postComments.save();
      return res.status(201).json(postComments);
    }

    const dislikedComment = singleComment.dislikes.find(
      (dislike) => dislike._id.toString() === req.user.id
    );
    if (dislikedComment) {
      return res.status(400).json({
        message: "Comment already liked by user",
      });
    }
    singleComment.dislikes.push(req.user.id);

    await postComments.save();
    res.status(200).json({
      comments: postComments,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};

//@desc: REPLY COMMENT ON COMMENT
//@route PUT: /api/posts/:post_id/comment/:comment_id/:single_id/reply
//@access Private
exports.replyCommentonComment = async (req, res) => {
  const { comment_id } = req.params;
  const { post_id } = req.params;
  const { single_id } = req.params;

  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return re.status(404).json({
        message: "This post does not exist",
      });
    }
    // console.log(req.params.comment_id);

    const postComments = await Comments.findOne({ post: post_id });
    if (!postComments) {
      return res
        .status(404)
        .json({ message: "No comments were found for this post" });
    }

    const { comments } = postComments;
    // console.log(comment_id);

    const userComment = getValue(comments, comment_id);

    // console.log(userComment);
    const { comment } = userComment;

    const singleComment = comment.find(
      (single) => single._id.toString() === single_id
    );

    if (!singleComment) {
      return res.status(404).json({
        message: "This comment does not exist",
      });
    }

    const newReply = {};
    newReply.text = req.body.text;
    newReply.user = req.user.id;
    newReply.replyTo = req.params.user_id;

    singleComment.reply.push(newReply);

    await postComments.save();

    post.comments++;
    await post.save();

    res.status(200).json({
      comments: postComments,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};

//@desc: LIKE REPLY COMMENT ON COMMENT
//@route PUT: /api/posts/:post_id/comment/:comment_id/:single_id/like/reply_id
//@access Private
exports.likeReplyCommentonComment = async (req, res) => {
  const { comment_id } = req.params;
  const { post_id } = req.params;
  const { single_id } = req.parazms;
  const { reply_id } = req.parazms;

  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return re.status(404).json({
        message: "This post does not exist",
      });
    }
    // console.log(req.params.comment_id);

    const postComments = await Comments.findOne({ post: post_id });
    if (!postComments) {
      return res
        .status(404)
        .json({ message: "No comments were found for this post" });
    }

    const { comments } = postComments;
    // console.log(comment_id);

    const userComment = getValue(comments, comment_id);

    // console.log(userComment);
    const { comment } = userComment;

    const singleComment = comment.find(
      (single) => single._id.toString() === single_id
    );

    if (!singleComment) {
      return res.status(404).json({
        message: "This comment does not exist",
      });
    }
    const reply = getValue(singleComment, reply_id);
    if (!reply)
      return res.status(404).json({
        message: "This reply was not found",
      });

    const dislikedPost = reply.dislikes.find(
      (dislike) => dislike._id.toString() === user_id
    );
    if (dislikedPost) {
      const dislikeIndex = reply.dislikes
        .map((dislike) => dislike._id.toString() === user_id)
        .indexOf(user_id);

      reply.dislikes.splice(dislikeIndex, 1);

      reply.likes.push(user_id);
      await postComments.save();
      return res.status(201).json(postComments);
    }
    const likedComment = reply.likes.find(
      (like) => like._id.toString() === req.user.id
    );
    if (likedComment) {
      return res.status(400).json({
        message: "Comment already liked by user",
      });
    }
    reply.likes.push(req.user.id);

    await postComments.save();
    res.status(200).json({
      comments: postComments,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};

//@desc: DISLIKE REPLY COMMENT ON COMMENT
//@route PUT: /api/posts/:post_id/comment/:comment_id/:single_id/dislike/reply_id
//@access Private
exports.dislikeReplyCommentonComment = async (req, res) => {
  const { comment_id } = req.params;
  const { post_id } = req.params;
  const { single_id } = req.parazms;
  const { reply_id } = req.parazms;

  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return re.status(404).json({
        message: "This post does not exist",
      });
    }
    // console.log(req.params.comment_id);

    const postComments = await Comments.findOne({ post: post_id });
    if (!postComments) {
      return res
        .status(404)
        .json({ message: "No comments were found for this post" });
    }

    const { comments } = postComments;
    // console.log(comment_id);

    const userComment = getValue(comments, comment_id);

    // console.log(userComment);
    const { comment } = userComment;

    const singleComment = comment.find(
      (single) => single._id.toString() === single_id
    );

    if (!singleComment) {
      return res.status(404).json({
        message: "This comment does not exist",
      });
    }
    const reply = getValue(singleComment, reply_id);
    if (!reply)
      return res.status(404).json({
        message: "This reply was not found",
      });

    const likedPost = reply.likes.find(
      (like) => like._id.toString() === user_id
    );
    if (likedPost) {
      const likeIndex = reply.likes
        .map((like) => like._id.toString() === user_id)
        .indexOf(user_id);

      reply.likes.splice(likeIndex, 1);

      reply.dislikes.push(user_id);
      await postComments.save();
      return res.status(201).json(postComments);
    }
    const dislikedComment = reply.dislikes.find(
      (dislike) => dislike._id.toString() === req.user.id
    );
    if (dislikedComment) {
      return res.status(400).json({
        message: "Comment already liked by user",
      });
    }
    reply.dislikes.push(req.user.id);

    await postComments.save();
    res.status(200).json({
      comments: postComments,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};
