import User from "../modules/user.module.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  )
    return next(errorHandler(400, "All fields are required!"));

  const hashPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashPassword,
  });
  try {
    await newUser.save();
    res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "")
    return next(errorHandler(400, "All fields are required!"));

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPAssword = bcryptjs.compareSync(password, validUser.password);
    if (!validPAssword) {
      return next(errorHandler(400, "Invalid password"));
    }
    const token = jwt.sign(
      {
        id: validUser._id,
        isAdmin: validUser.isAdmin,
      },
      process.env.JWT_SECRET_KEY
    );
    const { password: pass, __v, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // Set to true in production
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json(rest);
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  if (
    !email ||
    !name ||
    !googlePhotoUrl ||
    googlePhotoUrl === "" ||
    email === "" ||
    name === ""
  )
    return next(errorHandler(400, "All fields are required!"));

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        {
          id: user._id,
          isAdmin: validUser.isAdmin,
        },
        process.env.JWT_SECRET_KEY
      );
      const { password: pass, __v, ...rest } = user._doc;
      res
        .status(200)
        .cookie("token", token, {
          secure: true, // Set to true in production
          sameSite: "None",
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generateedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashPassword = bcryptjs.hashSync(generateedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split("").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        {
          id: newUser._id,
          isAdmin: validUser.isAdmin,
        },
        process.env.JWT_SECRET_KEY
      );
      const { password: pass, __v, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};
