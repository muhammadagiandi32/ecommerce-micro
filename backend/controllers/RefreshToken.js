import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    // return res.json(refreshToken);

    if (!refreshToken) return res.sendStatus(401);
    const User = await Users.findAll({
      where: {
        token: refreshToken,
      },
    });
    if (!User[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const userId = User[0].id;
        const name = User[0].name;
        const email = User[0].email;
        const accessToken = jwt.sign(
          { userId, email, name },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "15s",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    res.json(error);
    // console.log(error);
  }
};
