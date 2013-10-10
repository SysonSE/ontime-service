"use strict";
var express = require('express'),
	app = module.exports = express(),
    Company = require('./company');

app.get('/companies', function(req, res) {
    console.log("getting some companies...2");
//    Company.find().exec(function(resultSet) {
//        res.send(200, JSON.stringify(resultSet));
//    });

    Company.find({}, function(err, docs) {
        if (!err){
            console.log(docs);
            res.send(200, JSON.stringify(docs));
        } else {
            throw err;
        }
    });

//
//    SiteModel.find(
//        {},
//        function(err, docs) {
//            if (!err){
//                console.log(docs);
//                process.exit();
//            }
//            else { throw err;}
//
//        }
//    );

});

app.post('/companies', function(req, res) {
    var parsedCompany = JSON.parse(req.body.company);
    console.log("parsedCompany=" + JSON.stringify(parsedCompany));

    if(!req.body.company) {
        res.send(400, "Required parameter 'company' is missing in request");
    } else if(parsedCompany._id) {
        res.send(400, "Id already set, use PUT to update");
    } else {
        var company = new Company(parsedCompany);
        console.log("db entity company: " + company + " json=" + JSON.stringify(company));

        company.save(function(err) {
            if(err) {
                console.log('Error saving company: ' + company);
                res.send(400);
            } else {
                res.send(200, company);
            }
        });
    }
});

app.get('/companies/:id', function(req, res) {
    console.log("Get company with params.id " + req.params.id);

    Company.findOne({_id : req.params.id}, function(err, resultSet) {
        res.send(200, JSON.stringify(resultSet));
    });
});



