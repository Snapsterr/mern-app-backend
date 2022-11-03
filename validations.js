import { body } from "express-validator"

export const loginValidation = [
  body("email", "Wrong email format").isEmail(),
  body("password", "Password need minimum 5 symbols").isLength({ min: 5 }),
]

export const registerValidation = [
  body("email", "Wrong email format").isEmail(),
  body("password", "Password need minimum 5 symbols").isLength({ min: 5 }),
  body("fullName", "Type the name").isLength({ min: 3 }),
  body("avatarUrl", "Wrong link on avatar").optional().isURL(),
]

export const postCreateValidation = [
  body("title", "Type article title").isLength({ min: 3 }).isString(),
  body("text", "Type article text").isLength({ min: 3 }).isString(),
  body("tags", "Invalid tags format").optional().isString(),
  body("imageUrl", "Wrong link on image").optional().isString(),
]

export const commentCreateValidation = [
  body("text", "Type article text").isLength({ min: 1 }).isString(),
]
