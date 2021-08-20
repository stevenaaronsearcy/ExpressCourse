var express = require('express');
var router = express.Router();
var models = require("../models");
var passport = require("../services/passport");

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.user && req.user.Admin) {
    models.users.findAll({}).then((users) => {
      res.render("listUsers", { users: users })
    });
  } else {
    res.send("You are not authorized to view the users list.")
  }
});




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
        Password: req.body.password,
      },
    })
    .spread(function (result, created) {
      if (created) {
        res.redirect("login");
      } else {
        res.send("This user already exists!");
      }
    });
});




router.get("/login", function(req, res, next){
  res.render("login");
})

// router.post("/login", function (req, res, next) {
//   models.users
//     .findOne({
//       where: {
//         UserName: req.body.username,
//         Password: req.body.password,
//       },
//     })
//     .then((user) => {
//       if (user) {
//         res.send("Login succeeded!");
//       } else {
//         res.send("Invalid login!");
//       }
//     });
// });

// router.post("/login", function (req, res, next) {
//   models.users
//     .findOne({
//       where: {
//         UserName: req.body.username,
//         Password: req.body.password,
//       },
//     })
//     .then((user) => {
//       if (user) {
//         res.redirect("profile/" + user.UserId);
//       } else {
//         res.send("Invalid login!");
//       }
//     });
// });

// router.post("/login", passport.authenticate("local", {
//   failureRedirect: "/users/login"
// }),
//   function (req, res, next) {
//     res.redirect("profile/" + req.user.UserId);
//   });

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/users/login" }),
  function (req, res, next) {
    res.redirect("profile");
  }
);





// router.get("/profile/:id", function(req, res, next){
//   models.users.findByPk(parseInt(req.params.id)).then((user) => {
//     if (user) {
//       res.render("profile", {
//         FirstName: user.FirstName,
//         LastName: user.LastName,
//         Email: user.Email,
//         UserName: user.UserName
//       });
//     } else {
//       res.send("User not found!");
//     }
//   });
// });

router.get("/profile", function (req, res, next) {
  if (req.user) {
    models.users.findByPk(parseInt(req.user.UserId)).then((user) => {
      if (user) {
        res.render("profile", {
          FirstName: user.FirstName,
          LastName: user.LastName,
          Email: user.Email,
          UserName: user.UserName,
        });
      } else {
        res.send("User not found");
      }
    });
  } else {
    res.redirect("/users/login");
  }
});

router.post("/:id", function (req, res, next) {
  if (req.user && req.user.Admin) {
    let userId = parseInt(req.params.id);
    models.users
      .update(
        {
          Deleted: true,
        },
        {
          where: {
            UserId: userId,
          },
        }
      )
      .then(function (result) {
        if (result) {
          res.send("User has been deleted!");
        } else {
          res.send("User can not be deleted!");
        }
      });
  }
});

module.exports = router;
