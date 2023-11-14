import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const getUser = async (req, res) => {
  try {
    const response = await User.findAll();
    res.sendStatus(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const Register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;

  if (password !== confPassword)
    return res.status(400).json({ msg: "Password dont Match" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await User.create({
      email: email,
      name: name,
      password: hashPassword,
    });
    res.status(201).json({ errors: [{ msg: "Register Successfuly!" }] });
  } catch (error) {
    // console.log(error);
    res.status(400).json({ errors: [{ msg: "Email has been registered!" }] });
  }
};

export const Login = async (req, res) => {
  try {
    const user = await User.findAll({
      where: {
        email: req.body.email,
      },
    });

    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match)
      return res
        .status(400)
        .json({ errors: [{ msg: "Password someting worng!!!" }] });

    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;

    const accessToken = jwt.sign(
      { userId, email, name },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );
    const refreshToken = jwt.sign(
      { userId, email, name },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await User.update(
      { token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    });

    res.status(200).json({ accessToken });
    // console.log(user[0].name);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const Logout = async (req, res) => {
  const initoken = req.cookies.refreshToken;
  if (!initoken) return res.sendStatus(204);
  const Users = await User.findAll({
    where: {
      token: initoken,
    },
  });
  // return res.sendStatus(200).json(initoken);
  if (!Users[0]) return res.sendStatus(204);
  const userId = Users[0].id;
  await User.update({ token: null }, { where: { id: userId } });
  res.clearCookie("refreshToken");
  return res.status(200).json({ msg: "Your accound hasbend logout" });
};
