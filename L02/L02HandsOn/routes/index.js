var express = require("express");
var router = express.Router();

let flowers = [
  "Orchid",
  "Iris",
  "Hydrangea",
  "Amaryllis",
  "Dahlia",
  "Daffodil",
  "BleedingHeart",
];

/* GET home page. */
router.get("/", function (req, res, next) {
  let queryFlower = req.query.flower;
  if (flowers.includes(queryFlower)) {
    res.send("Yes, we do have a " + queryFlower + " in our garden");
  } else {
    res.send(
      "Nope, we dont have a " +
        queryFlower +
        " in our garden, but we should plant it!"
    );
  }
});

router.post("/", function (req, res) {
  let bodyFlower = req.body;
  if (flowers.includes(bodyFlower.flower)) {
    res.send("We already have that flower, no need to add it.");
  } else {
    flowers.push(bodyFlower.flower);
    res.send(flowers);
  }
});

module.exports = router;
