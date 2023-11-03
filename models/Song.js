const { Sequelize, db, Model, DataTypes } = require("../db");

// TODO - define the Song model

class Song extends Model {}

Song.init(
  {
    title: DataTypes.STRING,
    year: DataTypes.INTEGER,
    length: DataTypes.INTEGER,
  },
  {
    sequelize: db,
    modelName: "Song",
  }
);

module.exports = {
  Song,
};