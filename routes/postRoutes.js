const express = require("express");
const {
  getPosts,
  createNewPost,
  getPostById,
  likePost,
  commentPost,
  getPostComments,
  likeComment,
  commentOnComment,
  likeCommentonComment,
  replyCommentonComment,
  likeReplyCommentonComment,
  dislikeReplyCommentonComment,
  dislikeCommentonComment,
  dislikeComment,
  dislikePost,
} = require("../controllers/postControllers");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/", auth, getPosts);
router.get("/:post_id", auth, getPostById);
router.put("/:post_id/likes", auth, likePost);
router.put("/:post_id/dislikes", auth, dislikePost);

router.post("/create", auth, createNewPost);

router.put("/:post_id/comments", auth, commentPost);

router.get("/:post_id/comments", auth, getPostComments);

router.put("/:post_id/comments/:comment_id", auth, likeComment);
router.put("/:post_id/comments/:comment_id/dislike", auth, dislikeComment);

router.put("/:post_id/comments/:comment_id/comment", auth, commentOnComment);

router.put(
  "/:post_id/comments/:comment_id/comment/:single_id/like",
  auth,
  likeCommentonComment
);
router.put(
  "/:post_id/comments/:comment_id/comment/:single_id/dislike",
  auth,
  dislikeCommentonComment
);

router.post(
  "/:post_id/comments/:comment_id/comment/:single_id/reply/:user_id",
  auth,
  replyCommentonComment
);

router.post(
  "/:post_id/comments/:comment_id/comment/:single_id/reply/:reply_id/like",
  auth,
  likeReplyCommentonComment
);
router.post(
  "/:post_id/comments/:comment_id/comment/:single_id/reply/:reply_id/dislike",
  auth,
  dislikeReplyCommentonComment
);

module.exports = router;
