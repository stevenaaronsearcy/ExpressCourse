var express = require("express");
var router = express.Router();
var models = require("../models");
var authService = require("../services/auth");

/* GET posts listing. */

router.get("/", function (req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token).then(user => {
      if (user) {
        models.posts
          .findAll({
            where: { UserId: user.UserId, Deleted: false },
          })
          .then(result => res.render("posts", { posts: result, LoggedIn: true }));
        //console.log(user.posts);
        //res.render("posts", { posts: user.posts });
        //res.send(JSON.stringify(user));
      } else {
        res.status(401);
        res.send("Invalid authentication token");
      }
    });
  } else {
    res.status(401);
    res.send("Must be logged in");
  }
});

router.get("/newPost", function (req, res, next) {
  res.render("newPost", { LoggedIn: true });
});

router.post("/newPost", function (req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token).then((user) => {
      if (user) {
        models.posts
          .findOrCreate({
            where: {
              UserId: user.UserId,
              PostTitle: req.body.posttitle,
              PostBody: req.body.postbody,
            },
          })
          .spread((result, created) => res.redirect("/posts"));
      } else {
        res.status(401);
        res.send("Invalid Token");
      }
    });
  } else {
    res.status(401);
    res.send("Must be Logged In");
  }
});

router.get("/:id", function (req, res, next) {
  let postId = parseInt(req.params.id);
  models.posts
    .findOne({ where: { PostId: postId }, raw: true })
    .then((post) => {
      console.log(post);
      res.render("editPost", post);
    });
});

router.delete("/:id", function (req, res, next) {
  let postId = parseInt(req.params.id);
  models.posts
    .update(
      { Deleted: true },
      {
        where: { PostId: postId },
      }
    )
    .then((result) => res.redirect("/"));
});

router.put("/:id", function (req, res, next) {
  let postId = parseInt(req.params.id);
  console.log(req.body);
  console.log(postId);
  models.posts
    .update(req.body, { where: { PostId: postId } })
    .then((result) => res.redirect("/"));
});

module.exports = router;
