import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import UserModel from "../models/User.js"
import { randomAvatar } from "../utils/randomAvatar.js"

export const register = async (req, res) => {
  try {
    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const avatar = randomAvatar(1, 7)

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: `https://mui.com/static/images/avatar/${avatar}.jpg`,
      passwordHash: hash,
    })

    const user = await doc.save()

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    )

    const { passwordHash, ...userData } = user._doc

    res.json({
      ...userData,
      token,
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Failed to register",
    })
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email })

    if (!user) {
      return req.status(404).json({
        message: "User doesnt exist",
      })
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    )

    if (!isValidPass) {
      return res.status(400).json({
        message: "Invalid login or password",
      })
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    )

    const { passwordHash, ...userData } = user._doc

    res.json({
      ...userData,
      token,
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "failed to login",
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)

    if (!user) {
      return res.status(404).json({
        message: "User doesnt exist",
      })
    }

    const { passwordHash, ...userData } = user._doc

    res.json(userData)
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Access denied",
    })
  }
}
