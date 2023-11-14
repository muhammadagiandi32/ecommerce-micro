import { Sequelize } from "sequelize";

const db = new Sequelize("ecommer", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
