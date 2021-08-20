"use strict";
module.exports = (sequelize, DataTypes) => {
  var users = sequelize.define(
    "users",
    {
      UserId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      FirstName: DataTypes.STRING,
      LastName: DataTypes.STRING,
      Email: {
        type: DataTypes.STRING,
        unique: true,
      },
      UserName: {
        type: DataTypes.STRING,
        unique: true,
      },
      Admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      Password: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      Deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {}
  );

  return users;
};
