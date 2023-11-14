import express from "express";
import {
  getUser,
  Register,
  Login,
  Logout,
} from "../controllers/UserController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { check, query, validationResult } from "express-validator";

const router = express.Router();
router.get("/user", verifyToken, getUser);
router.post(
  "/register",
  [
    check("email", "Email is not valid").isEmail(),
    check("name", "Username field is required").not().isEmpty(),
    check("password", "Password field is required").not().isEmpty(),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 chars long"),
    check("password")
      .matches(/\d/)
      .withMessage("Password must contain a number"),
    check("confPassword").custom((value, { req }) => {
      //custom validator
      if (value !== req.body.password) {
        throw new Error("Passwords doesn't match");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return Register(req, res);
  }
);
router.post(
  "/login",
  [
    check("email", "Email is not valid").isEmail(),
    check("password", "Password field is required").not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return Login(req, res);
  }
);
router.get("/token", refreshToken);
router.delete("/logout", Logout);

export default router;
