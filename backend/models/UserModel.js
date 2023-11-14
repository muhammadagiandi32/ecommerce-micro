import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const User = db.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: DataTypes.UUID,
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    token: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
  }
);

export default User;

(async () => {
  await db.sync();
  // await User.sync({ force: true });
})();
