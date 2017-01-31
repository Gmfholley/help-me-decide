var config = require('../config.json');
var jwt = require('jsonwebtoken');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('decisions');

var service = {};

service.find = findById;
service.findByAttributes = findByAttributes;
service.create = create;
service.update = update;
service.delete = _delete;


function findByAttributes(attributes) {
    var deferred = Q.defer();

    db.decisions.findOne(
        attributes, 
        function (err, decision) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (decision) {

            deferred.resolve(defaultDecision(decision));
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function findById(_id) {
    var deferred = Q.defer();

    db.decisions.find(_id, function (err, decision) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (decision) {
            deferred.resolve(defaultDecision(decision));
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

            if (decision) {
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
                var docId = doc.ops[0]._id;
                deferred.resolve(jwt.sign({ id: docId }, config.secret));
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
            largeNumbers: decisionParam.largeNumbers,
            choices: decisionParam.choices,
            priorities: decisionParam.priorities,
            criteria: decisionParam.criteria
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

function defaultDecision(decision){
    
    // some constants - number of Criteria (priorites)
    var numCriteria = 4;
    var critParentId = "criterias-pad";
    var numColors = 5;


    var defDecision = {
            title: "Decision Maker",
            subtitle: "What should I do?",
            choicesTitles: ["Choice 1", "Choice 2", "Choice 3"],
            criteriaTitles: ["Cost", "Resources", "Customer Pain", "Urgency", "Buy-In", "Effect on Other Systems", "Difficulty", "Time", "Root Causes Addressed", "Extent Resolved", "Return on Investment", "Safety", "Training", "Team Control", "Cost to Maintain"],
            largeNumbers: "good",
    }

    var createChoices = function(){
        var choices = [];
        for(var i = 0; i < defDecision.choicesTitles.length; i ++) {
            var choice = {};
            choice.title = defDecision.choicesTitles[i];
            choice.id = i + 1;
            var ranks = [];
            for(var j = 0; j < numCriteria; j ++){
                var temp = {j: 1}
                ranks.push(1);
            }
            choice.ranks = ranks;
            choices.push(choice);
        }
       return choices;
    }

    var createCriteria = function(){
        var criterias = [];
        for(var i = 0; i < defDecision.criteriaTitles.length; i ++) {
            var criteria = {};
            criteria.title = defDecision.criteriaTitles[i];
            criteria.id = i + 1;
            criteria.parentId = critParentId;
            criteria.color = i % numColors + 1;
            criterias.push(criteria);
        }
        return criterias;
    }

    var createPriorities = function() {
        var priorities = [];
        for (var i = 0; i < numCriteria; i ++){
            var priority = {};
            priority.id = i + 1;
            priority.columnWidth = String(parseInt(1 / numCriteria * 100)) + '%';
            priorities.push(priority);
        }
        return priorities;
    }

    decision.title = decision.title || defDecision.title;
    decision.subtitle = decision.subtitle || defDecision.subtitle;
    decision.choices = decision.choices || createChoices();
    decision.criteria = decision.criteria || createCriteria();
    decision.priorities = decision.priorities || createPriorities();
    decision.largeNumbers = decision.largeNumbers || defDecision.largeNumbers;

    return decision;

}

/*
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
*/

module.exports = service;