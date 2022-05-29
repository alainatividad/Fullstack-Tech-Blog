const router = require("express").Router();
const { User, Comment, Post } = require("../../models");
// Import the custom middleware
const checkAuth = require("../../utils/authenticate");
//routes for /api/user

// route for signing up
router.post("/", async (req, res) => {
  try {
    console.log("get /api/user/");
    const userData = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.userId = userData.id;
      req.session.loggedIn = true;
      res.status(200).json(userData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// route for logging in
router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.userId = userData.id;
      req.session.loggedIn = true;
      res
        .status(200)
        .json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// route for logging out
router.post("/logout", (req, res) => {
  console.log("get /api/user/logout");
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// route for posting a comment
router.post("/comment", checkAuth, async (req, res) => {
  try {
    console.log("get /api/user/comment");
    const commentData = await Comment.create({
      content: req.body.content,
      post_id: req.body.postId,
      user_post: req.session.userId,
      date_created: Date(),
    });

    res.status(200).json(commentData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// redirect route for the dashboard
router.get("/dashboard", async (req, res) => {
  try {
    console.log("get /api/user/dashboard");
    const dashboardData = await Post.findAll({
      where: {
        user_id: req.session.userId,
      },
      include: [
        {
          // get related name to the post
          model: User,
          attributes: ["name"],
        },
      ],
    });

    //user has posts
    if (dashboardData) {
      const dashPosts = dashboardData.map((post) => post.get({ plain: true }));
      res.render("dashboard", {
        dashPosts,
        hasData: true,
        loggedIn: req.session.loggedIn,
        dashPage: true,
      });
    } else {
      res.render("dashboard", {
        hasData: false,
        loggedIn: req.session.loggedIn,
        dashPage: true,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// route for posting a post
router.post("/post", checkAuth, async (req, res) => {
  try {
    console.log("post /api/user/post");
    const postData = await Post.create({
      content: req.body.content,
      title: req.body.title,
      user_id: req.session.userId,
      date_created: Date(),
    });

    res.status(200).json(postData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// route for modifying a post
router.put("/post/:id", checkAuth, async (req, res) => {
  try {
    console.log("put /api/user/post");
    const postData = await Post.update(
      {
        content: req.body.content,
        title: req.body.title,
        user_id: req.session.userId,
        date_created: Date(),
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    console.log("postData");
    res.status(200).json(postData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// route for posting a post
router.delete("/post/:id", checkAuth, async (req, res) => {
  try {
    console.log("delete /api/user/post/id");
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!postData) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }
    res.status(200).json(postData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// route for logging out
router.get("/logout", (req, res) => {
  console.log("get /logout");
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();

      res.redirect("/");
    });
  } else {
    res.status(404).end();
  }
});
module.exports = router;
