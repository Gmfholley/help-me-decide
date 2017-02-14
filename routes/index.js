var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
        res.render('index', {title: "Decision Maker"});
});

router.get('/new', function(req, res, next){
	// create new request
	console.log(req.protocol + '://' + req.get('host') + process.env.API_URL + '/decisions/new');


	request.get(req.protocol + '://' + req.get('host') + process.env.API_URL + '/decisions/new', function(error, response){

		var body = JSON.parse(response.body);

        if (error || !body.token) {
            return res.send({ error: 'An error occurred' });
        }
        // since this is a new request, save the owner token in the session to give to the client
        req.session.token = body.token;


        console.log(req.protocol + '://' + req.get('host') + '/' + body.hash);
        res.redirect(req.protocol + '://' + req.get('host') + '/' + body.hash);
	});
});

router.get('/:hash', function(req, res, next){
	// create new request
	request.get(req.protocol + '://' + req.get('host') + process.env.API_URL + '/decisions/' + req.params.hash, function(error, response){
		var body = JSON.parse(response.body);

        if (error || !body) {
            return res.send({ error: 'An error occurred' });
        }
        
		// test params
		// body.title = "my test";
		// body.subtitle="my test title";
		// body.choices[0].title = "My test";
		// body.criteria[0].parentId = "priority-3";
		// body.criteria[1].parentId = "priority-1";
		// body.criteria[2].parentId = "priority-2";
		// body.criteria[3].parentId = "priority-4";
       //
		  res.cookie('token', req.session.token  || '');
		  res.render('show', { decision: body, numColors: 5, page: req.protocol + '://' + req.get('host') + req.url, title: "Decision Maker"});

	});
});


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
	color:
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