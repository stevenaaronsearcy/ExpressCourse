var express = require("express");
var router = express.Router();
var models = require("../models");
var authService = require("../services/auth");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.redirect("/users/login");
});

//Signup routes

router.get("/signup", function (req, res, next) {
  res.render("signup");
});

router.post("/signup", function (req, res, next) {
  models.users
    .findOrCreate({
      where: { UserName: req.body.username },
      defaults: {
        FirstName: req.body.firstname,
        LastName: req.body.lastname,
        Email: req.body.email,
        Password: authService.hashPassword(req.body.password),
        Admin: false,
      },
    })
    .spread(function (result, created) {
      if (created) {
        res.redirect("login");
      } else {
        res.send("This user already exists");
      }
    });
});

//login routes

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.post("/login", function (req, res, next) {
  models.users
    .findOne({
      where: {
        Username: req.body.username,
      },
    })
    .then((user) => {
      if (!user) {
        console.log("User not found");
        return res.status(401).json({
          message: "Login Failed",
        });
      } else {
        let passwordMatch = authService.comparePasswords(
          req.body.password,
          user.Password
        );
        if (passwordMatch) {
          let token = authService.signUser(user);
          res.cookie("jwt", token);
          if (user.Admin) {
            res.redirect("admin");
          } else {
            res.redirect("profile");
          }
        }
      }
    });
});

//Profile routes

router.get("/profile", function (req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token).then((user) => {
      if (user) {
        models.users
          .findAll({
            where: { UserId: user.UserId },
            include: [{ model: models.posts }],
          })
          .then((result) => {
            console.log(result);
            res.render("profile", { user: result[0], LoggedIn: true });
          });
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

router.get("/logout", function (req, res, next) {
  res.cookie("jwt", "", { expires: new Date(0) });
  res.redirect("login");
});

//Admin privelages

router.get("/admin", function (req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token).then((user) => {
      if (user.Admin) {
        models.users.findAll({}).then((usersFound) => {
          res.render("adminView", { users: usersFound, LoggedIn: true });
        });
      } else {
        res.send("You are not allowed.");
      }
    });
  }
});

router.get("/admin/editUser/:id", function (req, res, next) {
  let userId = parseInt(req.params.id);
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token).then((user) => {
      if (user.Admin) {
        models.users
          .findOne({ where: { UserId: userId }, raw: true })
          .then((user) => res.render("editUser", { user: user, LoggedIn:true }));
      } else {
        res.send("unauthorized");
      }
    });
  }
});

router.delete("/admin/editUser/:id", function (req, res, next) {
  let userId = parseInt(req.params.id);
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token).then((user) => {
      if (user.Admin) {
        models.users
          .update({ Deleted: true }, { where: { UserId: userId }, raw: true })
          .then((user) => res.redirect("/users/admin"));
      } else {
        res.send("unauthorized");
      }
    });
  }
});

module.exports = router;
