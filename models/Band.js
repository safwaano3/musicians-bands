const { Sequelize, db, Model, DataTypes } = require("../db");

class Band extends Model {}

Band.init(
  {
    name: DataTypes.STRING,
    genre: DataTypes.STRING,
    showCount: DataTypes.NUMBER,
  },
  {
    sequelize: db,
    modelName: "Band",
  }
);


module.exports = {
  Band,
};