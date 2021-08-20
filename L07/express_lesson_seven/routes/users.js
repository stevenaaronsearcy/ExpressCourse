var express = require("express");
var router = express.Router();
var models = require("../models");
var passport = require("passport");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//rendering the signup view
router.get("/signup", function (req, res, next) {
  res.render("signup");
});



//POST#1 Create Account
//allowing user to create an account and see if the user is already created.
//lowercase names(firstname etc.) must match the names in signup.hbs file.
// router.post("/signup", function (req, res, next) {
//   models.users.findOrCreate({
//     where: { UserName: req.body.username },
//     defaults: {
//       FirstName: req.body.firstname,
//       LastName: req.body.lastname,
//       Email: req.body.email,
//       Password: req.body.password,
//     },
//   }).spread (function(result, created){
//     if (created) {
//       res.send('User successfully created')
//     } else {
//       res.send('This user already exists!')
//     }
//   });
// });

//displays the login.hbs
router.get("/login", function (req, res, next) {
  res.render("login");
});

//POST#1 login
//alows the user to login and findsOne user with matched credentials
//if user entered correct credentials, it succeeds. If not, it is invalid.
 router.post('/login', function(req, res, next){
   models.users.findOne({
     where: {
       UserName: req.body.username,
       Password: req.body.password
       }
   }).then(user => {
     if(user) {
       res.send('Login succeeded!');
     } else {
       res.send('Invalid login!');
     }
  })
 });

//displays the users profile based on their ID.
// router.get("/profile/:id", function (req, res, next) {
//   models.users.findByPk(parseInt(req.params.id)).then((user) => {
//     if (user) {
//       res.render("profile", {
//         FirstName: user.FirstName,
//         LastName: user.LastName,
//         Email: user.Email,
//         UserName: user.UserName,
//       });
//     } else {
//       res.send("User not found");
//     }
//   });
// });

// router.post("/signup", function (req, res, next) {
//   models.users
//     .findOrCreate({
//       where: { UserName: req.body.username },
//       defaults: {
//         FirstName: req.body.firstname,
//         LastName: req.body.lastname,
//         Email: req.body.email,
//         Password: req.body.password,
//       },
//     })
//     .spread(function (result, created) {
//       if (created) {
//         res.send("User successfully created");
//       } else {
//         res.send("This user already exists!");
//       }
//     });
// });

//POST#2 create account. This post redirects to login screen after user signs up.
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

//POST#2
//Allows user to login however this time it redirect to their profile.
router.post("/login", function (req, res, next) {
  models.users
    .findOne({
      where: {
        UserName: req.body.username,
        Password: req.body.password,
      },
    })
    .then((user) => {
      if (user) {
        res.redirect("profile/" + user.UserId);
      } else {
        res.send("Invalid login!");
      }
    });
});

//POST#3
//Allows user to login however this time it redirect to their profile.
//However, this time we only use this lofin route after we have installed passport.
// router.post("/login", passport.authenticate("local", {
//     failureRedirect: "/users/login",
//   }),
//   function (req, res, next) {
//     res.redirect("profile/" + req.user.UserId);
//   }
// );

//displays the users profile based on their ID.
//This time, the users cannot just type in the ID, so we remove ID from the route.
// router.get("/profile/:id", function (req, res, next) {
//   models.users.findByPk(parseInt(req.params.id)).then((user) => {
//     if (user) {
//       res.render("profile", {
//         FirstName: user.FirstName,
//         LastName: user.LastName,
//         Email: user.Email,
//         UserName: user.UserName,
//       });
//     } else {
//       res.send("User not found");
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
          Username: user.Username,
        });
      } else {
        res.send("User not found");
      }
    });
  } else {
    res.redirect("/users/login");
  }
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/users/login" }),
  function (req, res, next) {
    res.redirect("profile");
  }
); //<--- Called Without UserID

module.exports = router;
