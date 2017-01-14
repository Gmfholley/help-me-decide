var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
	title: "Decision Maker",
	subtitle: "What should I do?",
	rankRange: 5,
	numCriteria: 4,
	numColors: 5,
	choices: ["Choice 1", "Choice 2", "Choice 3"],
	criteria: ["Cost", "Resources", "Customer Pain", "Urgency", "Buy-In", "Effect on Other Systems", "Difficulty", "Time", "Root Causes Addressed", "Extent Resolved", "Return on Investment", "Safety", "Training", "Team Control", "Cost to Maintain"]
	});
});

module.exports = router;
