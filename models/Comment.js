// import important parts of sequelize library
const { Model, DataTypes } = require("sequelize");
// import our database connection from config.js
const sequelize = require("../config/connection");
// import the two other tables since we're linking it to this table as foreign keys
const User = require("./User");
const Post = require("./Post");

// Initialize Comment model (table) by extending off Sequelize's Model class
class Comment extends Model {}

// set up fields and rules for Comment model
Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    user_post: {
      type: DataTypes.INTEGER,
      references: {
        Model: User,
        key: "id",
        unique: false,
      },
    },
    post_id: {
      type: DataTypes.INTEGER,
      references: {
        Model: Post,
        key: "id",
        unique: false,
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "comment",
  }
);

module.exports = Comment;
