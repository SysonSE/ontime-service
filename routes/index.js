"use strict";
var app = require('../app');

exports.index = function(req, res){

    res.send(JSON.stringify({
        routes: {
            GET: app.routes['get'],
            POST: app.routes['post'],
            PUT: app.routes['put'],
            DELETE: app.routes['delete']
        }
    }));
};

exports.companies = function(db) {
    return function(req, res) {
        var collection = db.get('company');

        collection.find({}, {}, function(e, docs){
            res.json(docs);
        });
    };
};

exports.companiesByOrgNr = function(db) {
    return function(req, res) {
        var companies = db.get('company');

        companies.find({'orgnummer' : req.params.orgnr}, '-email', function(e, docs) {
            res.json(docs);
        });
    };
};

exports.login = function(req, res) {
    res.json(200, {
        success: true,
        message: 'Login successful!'
    });
};
