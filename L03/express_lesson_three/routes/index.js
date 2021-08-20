var express = require("express");
var router = express.Router();
var storyLine = require("../models/storyLine");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: express });
  console.log(req.url)
});

router.get("/beginning/", function(req, res, next) {
let beginning = storyLine.story.find((story) => {
  return story.storyPart === "beginning"
});
res.render("beginning", { beginning });
});

router.get("/middle/", function (req, res, next) {
  let middle = storyLine.story.find((story) => {
    return story.storyPart === "middle";
  });
  res.render("middle", { middle });
});

router.get("/end/", function (req, res, next) {
  let end = storyLine.story.find((story) => {
    return story.storyPart === "end";
  });
  res.render("end", { end });
});



module.exports = router;
