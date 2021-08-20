/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "category",
    {
      category_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      last_update: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      default_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
      tableName: "category",
    }
  );
};
