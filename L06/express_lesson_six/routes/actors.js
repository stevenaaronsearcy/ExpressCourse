var express = require("express");
var router = express.Router();
var mysql = require("mysql2");
var models = require("../models");

// //Get all actors but adding attributes to simplify your returns
// router.get("/actors", function (req, res, next) {
//   models.actor
//     .findAll({
//       attributes: ["actor_id", "first_name", "last_name"],
//       include: [
//         {
//           attributes: [
//             "film_id",
//             "title",
//             "description",
//             "rental_rate",
//             "rating",
//           ],
//           model: models.film,
//         },
//       ],
//     })
//     .then((actorsFound) => {
//       res.setHeader("Content-Type", "applications/json");
//       res.send(JSON.stringify(actorsFound));
//     });
// });

// //Get actor based on ID, PK stands for primary key which is the actorid
// router.get("/actors/:id", function (req, res, next) {
//   models.actor
//     .findByPk(parseInt(req.params.id), {
//       include: [{ model: models.film }],
//     })
//     .then((actorsFound) => {
//       res.setHeader("Content-Type", "application/json");
//       res.send(JSON.stringify(actorsFound));
//     });
// });

// //Create new actor if the actor doesn't already exist
// router.post("/actors", function (req, res, next) {
//   models.actor
//     .findOrCreate({
//       where: {
//         first_name: req.body.first_name,
//         last_name: req.body.last_name,
//       },
//     })
//     .spread(function (result, created) {
//       if (created) {
//         res.redirect("/actors/" + result.actor_id);
//       } else {
//         res.status(400);
//         res.send("Actor already exists");
//       }
//     });
// });

// //Create New Actor. Set header specifies the way we want our data.
// //stringify turns the data into a string.

// //router.post("/actors", function (req, res, next) {
// // models.actor
// //   .create(req.body)
// //   .then((newActor) => {
// //     res.setHeader("Content-Type", "application/json");
// //     res.send(JSON.stringify(newActor));
// //   })
// //  .catch((err) => {
// //     res.status(400);
// //     res.send(err.message);
// //   });
// // });

// //Updating an actor here based on their id. If successful the user will
// //redirected to the route specific for the actor. If not, throw error 400.

// router.put("/actors/:id", function(req, res, next){
//   let actorId = parseInt(req.params.id);
//   models.actor.update(req.body, { where: { actor_id: actorId }})
//   .then(result => res.redirect("/actors/" + actorId))
//   .catch(err => {
//     res.status(400);
//     res.send("There was a problem updating the actor. Please check the actor information.");
//   });
// });

// router.delete("/actors/:id", function(req, res, next) {
//   let actorId = parseInt(req.params.id);
//   models.actor.destroy({
//     where: { actor_id: actorId }
//   })
//   .then(result => res.redirect('/actors'))
//   .catch(err => {
//     res.status(400);
//     res.send("There was a problem deleting the actor.");
//   });
// });

//Remember to remove /actors path from all of your routes otherwise it will direct to actors/actors
//Because we changed the routes in our app.js
//We are doing this below, which is why the previous code will be commented out.

router.get("/", function (req, res, next) {
  models.actor
    .findAll({
      attributes: ["actor_id", "first_name", "last_name"],
      include: [
        {
          attributes: [
            "film_id",
            "title",
            "description",
            "rental_rate",
            "rating",
          ],
          model: models.film,
        },
      ],
    })
    .then((actorsFound) => {
      res.setHeader("Content-Type", "applications/json");
      res.send(JSON.stringify(actorsFound));
    });
});

//Get actor based on ID, PK stands for primary key which is the actorid
router.get("/:id", function (req, res, next) {
  models.actor
    .findByPk(parseInt(req.params.id), {
      include: [{ model: models.film }],
    })
    .then((actorsFound) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(actorsFound));
    });
});

//Create new actor if the actor doesn't already exist
router.post("/", function (req, res, next) {
  models.actor
    .findOrCreate({
      where: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
      },
    })
    .spread(function (result, created) {
      if (created) {
        res.redirect("/actors/" + result.actor_id);
      } else {
        res.status(400);
        res.send("Actor already exists");
      }
    });
});

//Create New Actor. Set header specifies the way we want our data.
//stringify turns the data into a string.

//router.post("/actors", function (req, res, next) {
// models.actor
//   .create(req.body)
//   .then((newActor) => {
//     res.setHeader("Content-Type", "application/json");
//     res.send(JSON.stringify(newActor));
//   })
//  .catch((err) => {
//     res.status(400);
//     res.send(err.message);
//   });
// });

//Updating an actor here based on their id. If successful the user will
//redirected to the route specific for the actor. If not, throw error 400.

router.put("/:id", function (req, res, next) {
  let actorId = parseInt(req.params.id);
  models.actor
    .update(req.body, { where: { actor_id: actorId } })
    .then((result) => res.redirect("/actors/" + actorId))
    .catch((err) => {
      res.status(400);
      res.send(
        "There was a problem updating the actor. Please check the actor information."
      );
    });
});

router.delete("/:id", function (req, res, next) {
  let actorId = parseInt(req.params.id);
  models.actor
    .destroy({
      where: { actor_id: actorId },
    })
    .then((result) => res.redirect("/actors"))
    .catch((err) => {
      res.status(400);
      res.send("There was a problem deleting the actor.");
    });
});
module.exports = router;
