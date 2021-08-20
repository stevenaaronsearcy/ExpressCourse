var express = require('express');
var router = express.Router();
var models = require("../models");
var authService = require("../services/auth");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// router.post("/signup", function(req, res, next){
//   models.users.findOrCreate({
//     where: { UserName: req.body.username },
//     defaults: {
//       FirstName: req.body.firstname,
//       LastName: req.body.lastname,
//       Email: req.body.email,
//       Password: req.body.password
//     }
//   }).spread(function(result, created){
//     if(created) {
//       res.send("User successfully created");
//     } else {
//       res.send("This user already exists");
//     }
//   });
// });

// router.post("/login", function(req, res, next){
//   models.users.findOne({
//     Where: {
//       UserName: req.body.username,
//       Password: req.body.password
//     }
//   }).then(user => {
//     if (!user) {
//       console.log("User not found")
//       return res.status(401).json({
//         message: "Login Failed"
//       });
//     }
//     if (user) {
//       let token = authService.signUser(user);
//       res.cookie("jwt", token);
//       res.send("Login successful");
//     } else {
//       console.log("Wrong Password");
//       res.redirect("login")
//     }
//   });
// });

// router.get("/profile", function(req, res, next) {
//   let token = req.cookies.jwt;
//   authService.verifyUser(token)
//   .then(user => {
//     if (user) {
//       res.send(JSON.stringify(user));
//     } else {
//       res.status(401);
//       res.send("Must be logged in");
//     }
//   })
// });

router.get("/logout", function(req, res, next){
  res.cookie("jwt", "", { expires: new Date(0) });
  res.send("logged out");
});

//New peofile route after logout is added
router.get("/profile", function (req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
  authService.verifyUser(token).then(user => {
    if (user) {
      res.send(JSON.stringify(user));
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


//New Signup after the bcrypt is incorporated so the password will be hashed.
router.post('/signup', function (req, res, next) {
  models.users
    .findOrCreate({
      where: {
        UserName: req.body.username
      },
      defaults: {
        FirstName: req.body.firstname,
        LastName: req.body.lastname,
        Email: req.body.email,
        Password: authService.hashPassword(req.body.password) //<--- Change to this code here
      }
    })
    .spread(function (result, created) {
      if (created) {
        res.send('User successfully created');
      } else {
        res.send('This user already exists');
      }
    });
});


router.post("/login", function (req, res, next) {
  models.users
    .findOne({
      where: {
        UserName: req.body.username,
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
          res.send("Login successful");
        } else {
          console.log("Wrong password");
          res.send("Wrong password");
        }
      }
    });
});

router.get("/profile/:id", authService.verifyUser, function (req, res, next) {
  if (req.params.id !== String(req.user.UserId)) {
    res.send("This is not your profile");
  } else {
    let status;
    if (req.user.Admin) {
      status = "Admin";
    } else {
      status = "Normal user";
    }

    res.render("profile", {
      FirstName: req.user.FirstName,
      LastName: req.user.LastName,
      Email: req.user.Email,
      UserId: req.user.UserId,
      UserName: req.user.UserName,
      Status: status,
    });
  }
});


module.exports = router;
