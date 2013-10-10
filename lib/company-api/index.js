"use strict";
var express = require('express'),
	app = module.exports = express(),
    Company = require('./company');

// hitta alla företag
app.get('/companies', function(req, res) {
    console.log("getting some companies...");

    Company.find({}, function(err, docs) {
        if (!err){
            console.log(docs);
            res.send(200, JSON.stringify(docs));
        } else {
            throw err;
        }
    });
});

// hitta ett företag
app.get('/companies/:id', function(req, res) {
    console.log("Get company with params.id " + req.params.id);

    Company.findById(req.params.id, function(err, resultSet) {
        res.send(200, JSON.stringify(resultSet));
    });
});

// spara ett nytt företag
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
                throw err;
            } else {
                res.send(200, company);
            }
        });
    }
});

// uppdatera ett befintligt företag
app.put('/companies', function(req, res) {
    var parsedCompany = JSON.parse(req.body.company);

    var id = parsedCompany._id;
    delete parsedCompany._id;

    if(!id) {
        res.send(400, "No id found, use post to save new company. Got: " + req.body.company);
    } else {
        var company = new Company(parsedCompany);
        Company.findOneAndUpdate({_id : id}, parsedCompany, function(err, doc) {
            if(err) throw err;
            else {
                console.log("Update returned=" + doc);
                res.send(200, JSON.stringify(doc));
            }
        });
    }
});