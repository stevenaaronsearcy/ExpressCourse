var express = require("express");
var router = express.Router();
var mysql = require("mysql2");
var models = require("../models");
var Sequelize = require("sequelize");
var op = Sequelize.Op;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//router.get("/actors", function (req, res, next) {
// models.actor.findAll({}).then((actorsFound) => {
//   res.render("actors", {
//     actors: actorsFound,
//  });
// });
// });

//Not realistic and inconvenient//

//router.get("/specificActor", function (req, res, next) {
// models.actor
//   .findOne({
//    where: { actor_id: 2 },
//  })
//  .then((actor) => {
//    res.render("specificActor", {
//     actor: actor,
//    });
//  });
//});

//Find actor based on Id number//

//router.get("/actor/:id", function (req, res, next) {
// let actorId = parseInt(req.params.id);
// models.actor
//  .findOne({
//    where: {
//      actor_id: actorId,
//    },
//  })
//  .then((actor) => {
//    res.render("specificActor", {
//      actor: actor,
//    });
//   });
//});

//Operator based on what you're looking for. gt means greater than.//
//similiar to what you would run in NoSQL//

// router.get("/actors", function (req, res, next) {
// models.actor
//  .findAll({
//    where: {
//      [op.and]: {
//       actor_id: { [op.gt]: 55 },
//       last_name: { [op.like]: "G%" }, //G% starts with a G
//     },
//   },
// })
//  .then((actorsFound) => {
//    res.render("actors", {
//      actors: actorsFound,
//   });
// });
// });

//Finds an entire list of actors and with post method lets you add one//

router.get("/actors", function (req, res, next) {
 models.actor.findAll({}).then((actorsFound) => {
   res.render("actors", {
    actors: actorsFound,
  });
 });
});

//How you would find data within the database and then provide it to the front end application//

router.get("/actors", function (req, res, next) {
  models.actor.findAll({}).then((actorsFound) => {
    let mappedActors = actorsFound.map((actor) => ({
      ActorID: actor.actor_id,
      Name: `${actor.first_name} ${actor.last_name}`,
    }));
    res.send(JSON.stringify(mappedActors));
  });
});

//First function checks to see if actor already exists//
router.post("/actor", function (req, res, next) {
  models.actor
    .findOrCreate({
      where: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
      },
    })
    .spread(function (result, created) {
      if (created) {
        res.redirect("/actors");
      } else {
        res.send("This actor already exists.");
      }
    });
});

module.exports = router;
