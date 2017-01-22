var config = require('../../config.json');
var express = require('express');
var router = express.Router();
var randomstring = require('randomstring');
var decisionService = require('../../services/decision');

// routes
router.post('/authenticate', authenticateDecision);
router.get('/new', newDecision);
router.get('/:hash', findDecision);
router.put('/:hash', updateDecision);




function authenticateDecision(req, res) {
    var tryId = jwt.verify(req.token, config.secret);


    decisionService.authenticate(req.body.hash, tryId)
        .then(function (token) {
            if (token) {
                res.send({ token: token });
            } else {
                res.status(401).send('You are not authorized to change that decision');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function newDecision(req, res) {
    var newHash = randomstring.generate({
        charset: 'alphanumeric',
        capitalization: 'lowercase'
    });
    decisionService.create(
    { hash: newHash })
        .then(function (token) {
            res.send({ status: 200, hash: newHash, token: token});
        })
        .catch(function (err) {
            // do again, requesting a hash that is not already taken
            res.redirect(config.apiURL + '/decisions/new');
        });
}

function findDecision(req, res) {
    decisionService.findByAttributes({hash: req.params.hash})
        .then(function (decision) {

            if (decision) {
                res.send(decision);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateDecision(req, res) {
    var decisionId = req.decision.sub;

    if (req.params._id !== decisionId) {
        return res.status(401).send('You can only update your own decisions');
    }

    decisionService.update(decisionId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports = router;
