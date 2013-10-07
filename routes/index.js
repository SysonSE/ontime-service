"use strict";
var app = require('../app');

exports.index = function(req, res){

    res.send(JSON.stringify({
        app: 'ontime',
        awesomeness: 'super-awesome',
        version: 'alpha',
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
            var json = JSON.stringify(docs);
            res.send(json);
        });
    };
};

exports.companiesByOrgNr = function(db) {
    return function(req, res) {
        var companies = db.get('company');

        companies.find({'orgnummer' : req.params.orgnr}, '-email', function(e, docs) {
            var json = JSON.stringify(docs);
            res.send(json);
        });
    };
};

exports.secretArea = function(req, res) {
    res.send('you made it through to the secret area');
};
