const router = require("express").Router();
const sequelize = require("../config/connection");
const { Comment, Post, User } = require("../models");
// Import the custom middleware
const checkAuth = require("../utils/authenticate");

router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));
    console.log("get /");

    // Send the rendered Handlebars.js template back as the response
    res.render("homepage", {
      posts,
      loggedIn: req.session.loggedIn,
      dashPage: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          // get related name to the post
          model: User,
          attributes: ["name"],
        },
        {
          model: Comment,
          include: [
            {
              // get related name to the comment
              model: User,
              attributes: ["name"],
            },
          ],
        },
      ],
    });
    // const posts = postData.map((post) => post.get({ plain: true }));
    const posts = postData.get({ plain: true });
    console.log("get /post/id");
    // console.log(posts);
    // console.log("----------------------");
    // console.log(JSON.parse(JSON.stringify(posts.comments)));
    // Send the rendered Handlebars.js template back as the response
    res.render("post", {
      posts,
      loggedIn: req.session.loggedIn,
      btnClicked: false,
      dashPage: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/dashboard", checkAuth, (req, res) => {
  console.log("get /dashboard");
  res.redirect("/api/users/dashboard");
  // res.render("dashboard");
});

router.get("/login", (req, res) => {
  console.log("get /login");
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login", {
    loggedIn: req.session.loggedIn,
    dashPage: false,
  });
});

router.get("/signup", (req, res) => {
  console.log("get /signup");
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("signup", {
    loggedIn: req.session.loggedIn,
    dashPage: false,
  });
});

module.exports = router;
