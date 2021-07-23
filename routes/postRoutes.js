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
} = require("../controllers/postControllers");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/", auth, getPosts);
router.get("/:post_id", auth, getPostById);
router.put("/:post_id/likes", auth, likePost);

router.post("/create", auth, createNewPost);

router.put("/:post_id/comments", auth, commentPost);

router.get("/:post_id/comments", auth, getPostComments);

router.put("/:post_id/comments/:comment_id", auth, likeComment);

router.put("/:post_id/comments/:comment_id/comment", auth, commentOnComment);

router.put(
  "/:post_id/comments/:comment_id/comment/:single_id/like",
  auth,
  likeCommentonComment
);

router.post(
  "/:post_id/comments/:comment_id/comment/:single_id/reply/:user_id",
  auth,
  replyCommentonComment
);

router.put(
  "/:post_id/comments/:comment_id/comment/:single_id/like/:reply_id",
  auth,
  likeCommentonComment
);

module.exports = router;
