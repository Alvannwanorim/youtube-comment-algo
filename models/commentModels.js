const mongoose = requires("mongoose");

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
    required: true,
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  dislikes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  comment: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now(),
  },
  reply: {},
});

// [
//
//       newComments: [
//         {
//           user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//           },
//           text: {
//             type: String,
//             required: true,
//           },
//           date: {
//             type: Date,
//             default: Date.now(),
//           },
//         },
//       ],

//     },
//   ]
