var express = require("express");
var router = express.Router();
var mysql = require("mysql2");
var models = require("../models");

//Get all films with no special attributes.
router.get("/", function (req, res, next) {
  models.film.findAll({}).then((filmsFound) => {
    res.setHeader("Content-Type", "applications/json");
    res.send(JSON.stringify(filmsFound));
  });
});

//Get films with specific film_id, PK means that film_id is primaryKey.
router.get("/:id", function (req, res, next) {
  models.film.findByPk(parseInt(req.params.id)).then((filmsFound) => {
    res.setHeader("COntent-Type", "applications/json");
    res.send(JSON.stringify(filmsFound));
  });
});

//Update films based on the film_id and then redirect back to '/films'.
router.put("/:id", function (req, res, next) {
  let filmId = parseInt(req.params.id);
  models.film
    .update(req.body, { where: { film_id: filmId } })
    .then((result) => res.redirect("/films/" + filmId))
    .catch((err) => {
      res.status(400);
      res.send("There was a problem updating the actor!");
    });
});

module.exports = router;
