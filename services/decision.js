var config = require('../config.json');
var jwt = require('jsonwebtoken');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('decisions');

var service = {};

service.authenticate = authenticate;
service.find = find;
service.create = create;
service.update = update;
service.delete = _delete;

function authenticate(hash, _id) {
    var deferred = Q.defer();

    db.decisions.findById(_id, function (err, decision) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // no log in - authentication === encrypted id 
        if (decision && (decision.id == _id) ) {
            deferred.resolve(jwt.sign({ sub: decision._id }, config.secret));
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}


function find(_id) {
    var deferred = Q.defer();

    db.decisions.findById(_id, function (err, decision) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (decision) {
            deferred.resolve();
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(decisionParam) {
    var deferred = Q.defer();

    // validate hash is unique
    db.decisions.findOne(
        { hash: decisionParam.hash },
        function (err, decision) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (hash) {
                deferred.reject('hash "' + decisionParam.hash + '" is already taken');
            } else {
                createdecision();
            }
        });

    function createdecision() {

        db.decisions.insert(
            decisionParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                // send back with the encrypted id -- this is only validation
                deferred.resolve(jwt.sign({ sub: doc._id }, config.secret));
            });
    }

    return deferred.promise;
}

function update(_id, decisionParam) {
    var deferred = Q.defer();

    db.decisions.findById(_id, function (err, decision) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        updatedecision();
    });

    function updatedecision() {

        var set = {
            title: decisionParam.title,
            subtitle: decisionParam.subtitle,
            criterias: decisionParam.criterias,
            priorities: decisionParam.priorities,
            choices: decisionParam.choices
        };

        db.decisions.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.decisions.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

module.exports = service;