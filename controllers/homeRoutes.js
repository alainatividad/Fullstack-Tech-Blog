const router = require("express").Router();
const sequelize = require("../config/connection");
const { Comment, Post, User } = require("../models");
// Import the custom middleware
const checkAuth = require("../utils/authenticate");

router.get("/", async (req, res) => {
  try {
    // get all records in the Post table
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    // Send the rendered Handlebars.js template back as the response
    // pass loggedIn status to either show the login and signup links or the logout button
    // pass dashPage status to highlight the correct page
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
    // If the View Comment under each post is clicked, get the post and comments related to that post
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

    const posts = postData.get({ plain: true });

    // render the specific post page that would show the post, either an add a comment button or links to login/signup, and comments under it if any
    // pass loggedIn to show either Login/Signup or Logout on the navigation bar
    res.render("post", {
      posts,
      loggedIn: req.session.loggedIn,
      dashPage: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// route for clicking the dashboard link on the navigation page
// we'll run a middleware first so that if the user is not loggedIn (there is no stored sessionId), the user is redirected to the login page
// but if the user is logged in, redirect the route to /api/user/dashboard
router.get("/dashboard", checkAuth, (req, res) => {
  console.log("get /dashboard");
  // redirect the call to /api/users/dashboard
  res.redirect("/api/users/dashboard");
});

// route for logging in
// check if the user is logged in or not
// if loggedin, go to homepage else load login handlebars
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

// route for signing up
// if the user is loggedIn, redirect to homepage else load signup handlebars
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
