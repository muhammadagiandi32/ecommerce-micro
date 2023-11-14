"use strict";
// import { Sequelize } from "sequelize";
const { DataTypes } = require("sequelize");
// const { DataTypes } = Sequelize;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("product", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: DataTypes.UUID,
      stock: DataTypes.INTEGER,
      product_name: DataTypes.STRING,
      price: DataTypes.DECIMAL(10, 2),
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("product");
  },
};
