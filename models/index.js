// import models
const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");

// One to many association of User and Post (1 User for a number of Post)
User.hasMany(Post, {
  foreignKey: "user_id",
});

Post.belongsTo(User, {
  foreignKey: "user_id",
});

// One to many association of Post and Comment (1 Post to many comments)
Post.hasMany(Comment, {
  foreignKey: "post_id",
});

Comment.belongsTo(Post, {
  foreignKey: "post_id",
});

// One to many association of Post and Comment (1 Post to many comments)
User.hasMany(Comment, {
  foreignKey: "user_post",
});

Comment.belongsTo(User, {
  foreignKey: "user_post",
});
module.exports = {
  User,
  Post,
  Comment,
};
