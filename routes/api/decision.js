var express = require('express');
var router = express.Router();
var randomstring = require('randomstring');
var decisionService = require('../../services/decision');
var jwt = require('jsonwebtoken');

// routes
router.get('/new', newDecision);
router.get('/:hash', findDecision);
router.put('/:hash', updateDecision);



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
            res.redirect(process.env.API_URL + '/decisions/new');
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
    var decisionId = jwt.verify(req.headers.authorization, process.env.SECRET).id;

    if (! decisionId) {
        return res.status(401).send('You do not have permission to update the decision');
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
