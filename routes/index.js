var express = require('express');
var config = require('../config.json');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(config.apiUrl + '/decisions/new?valid=' + config.secret);
	// create new request
	request.get(config.apiUrl + '/decisions/new?valid=' + config.secret, function(error, response, body){
        if (error || !body.token) {
            return res.send({ error: 'An error occurred' });
        }
        // save JWT token in the session for client side
        req.session.token = body.token;
        console.log(response.body.hash);
        res.redirect('/' + response.body.hash);
	});
});

router.get('/:hash', function(req, res, next){
  res.render('index', { 
	title: "Decision Maker",
	subtitle: "What should I do?",
	rankRange: 5,
	numCriteria: 4,
	numColors: 5,
	choices: ["Choice 1", "Choice 2", "Choice 3"],
	criteria: ["Cost", "Resources", "Customer Pain", "Urgency", "Buy-In", "Effect on Other Systems", "Difficulty", "Time", "Root Causes Addressed", "Extent Resolved", "Return on Investment", "Safety", "Training", "Team Control", "Cost to Maintain"],
	largeNumbers: "good"
	});
})

module.exports = router;
/*{

Scenario 1 -
Hit /
get new unique hash
get unique token
get default criteria
redirected to /hash
get json web token with token, url redirect, and default criteria
unique hash and token saved to database

Scenario 2
get /hash
Check to see if in database
If not, return 404
If so, return page

Scenario 3

put-patch /hash
Check to see if hash exists
If not, return 404
If so, check to see if token matches token
If not, return not able to change
If so, update record
Return 200 - changed


post /hash --- not needed - created on get /
delete /hash --- not needed - so far not available




-----------

Separate out api layer, just in case
get api/authenticate
get api/hash				- get json object or error message
put or patch api/hash		- update and receive json object or error message
post api/hash				- hit only by server




rankRange: 5
numColors: 5


title:
subtitle:

numCriteria: criterias.length


criterias: [{
	title:
	id:
	parentId:
	class/color:
}]

priorities: [{
	id:
	columnWidth:
}]

choices: [{
	title:
	id:
	ranks: []
}]


}
*/