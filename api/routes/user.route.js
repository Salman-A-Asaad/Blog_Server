import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  signOut,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyUser } from "../utils/vreifyUser.js";
const router = express.Router();
router.put("/update/:userId", verifyUser, updateUser);
router.get("/getusers", verifyUser, getUsers);
router.delete("/delete/:userId", verifyUser, deleteUser);
router.post("/signout", signOut);
router.get("/:userId", getUser);
export default router;
