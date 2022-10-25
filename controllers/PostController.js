import PostModel from "../models/Post.js"
import { frequencySort } from "../utils/frequencySort.js"

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().exec()

    const tags = posts.map((obj) => obj.tags).flat()
    const sortedTags = frequencySort(tags)
      .filter((value, index, arr) => arr.indexOf(value) === index)
      .slice(0, 5)

    res.json(sortedTags)
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Failed to get tags",
    })
  }
}

export const getPostsByTag = async (req, res) => {
  try {
    const tagName = req.params.tag

    console.log(tagName)

    const posts = await PostModel.find({
      tags: tagName,
    })
      .sort({ viewsCount: -1 })
      .populate("user")
      .exec()

    console.log(posts)
    res.json(posts)
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Failed to get posts by this tag",
    })
  }
}

export const getAll = async (req, res) => {
  try {
    const sortQuery = req.query
    const defaultQuery = { sort: "createdAt", ...sortQuery }

    const builder = PostModel.find({})
    const { sort } = defaultQuery

    if (sort === "viewsCount") {
      builder.sort({ viewsCount: -1 })
    }
    if (sort === "createdAt") {
      builder.sort({ createdAt: -1 })
    }

    const posts = await builder.populate("user").exec()

    res.json(posts)
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Failed to get articles",
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          console.log(e)
          return res.status(500).json({
            message: "Failed to get articles",
          })
        }

        if (!doc) {
          return res.status(404).json({
            message: "Article not found",
          })
        }

        res.json(doc)
      }
    ).populate("user")
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Failed to get article",
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(e)
          return res.status(500).json({
            message: "Failed to delete article",
          })
        }

        if (!doc) {
          return res.status(404).json({
            message: "Article not found",
          })
        }

        res.json({
          success: true,
        })
      }
    )
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Failed to delete article",
    })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(",").map((tag) => tag.trim()),
      user: req.userId,
    })
    console.log(doc.tags)

    const post = await doc.save()

    res.json(post)
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Failed to create article",
    })
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(",").map((tag) => tag.trim()),
        user: req.userId,
      }
    )

    res.json({
      success: true,
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Failed to update article",
    })
  }
}
