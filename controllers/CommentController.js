import CommentModel from "../models/Comment.js"
import PostModel from "../models/Post.js"

export const createComment = async (req, res) => {
  try {
    const id = req.params.id

    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      post: req.body.postId,
    })

    const comment = await doc.save()

    PostModel.findOneAndUpdate(
      {
        _id: id,
      },
      { $push: { comments: comment } },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to get articles",
          })
        }

        if (!doc) {
          return res.status(404).json({
            message: "Article not found",
          })
        }
        console.log("doc", doc)
        res.json(doc)
      }
    )
      .populate({
        path: "comments",
        model: "Comment",
        populate: {
          path: "user",
          model: "User",
          select: "_id fullName avatarUrl",
        },
      })
      .populate("user")
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Failed to post comment",
    })
  }
}

export const getPopularPostComments = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ viewsCount: -1 })
      .populate({
        path: "comments",
        model: "Comment",
        populate: {
          path: "user",
          model: "User",
          select: "_id fullName avatarUrl",
        },
      })
      .exec()

    const comments = posts
      .map((obj) => obj.comments)
      .flat()
      .slice(0, 3)

    res.json(comments)
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Failed to get popular comments",
    })
  }
}
