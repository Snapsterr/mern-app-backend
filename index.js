import express from "express"
import fs from "fs"
import multer from "multer"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"

import {
  registerValidation,
  commentCreateValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js"

import { checkAuth, handleValidationErrors } from "./utils/index.js"

import {
  CommentController,
  PostController,
  UserController,
} from "./controllers/index.js"

dotenv.config()

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB ok"))
  .catch((e) => console.log("DB error", e))

const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads")
    }
    cb(null, "uploads")
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use("/uploads", express.static("uploads"))

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
)
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
)
app.get("/auth/me", checkAuth, UserController.getMe)

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  })
})

app.get("/tags", PostController.getLastTags)
app.get("/comments", CommentController.getPopularPostComments)

app.get("/tags/:tag", PostController.getPostsByTag)

app.get("/posts", PostController.getAll)

app.get("/posts/:id", PostController.getOne)

app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.createPost
)
app.post(
  "/posts/:id/comment",
  checkAuth,
  commentCreateValidation,
  handleValidationErrors,
  CommentController.createComment
)
app.delete("/posts/:id", checkAuth, PostController.removePost)
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.updatePost
)

app.listen(process.env.PORT || 3001, (err) => {
  if (err) {
    return console.log(err)
  }

  console.log("Server ok")
})

console.log("changed")
