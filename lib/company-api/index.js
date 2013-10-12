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

    Company.findById(req.params.id, function(err, doc) {
        if(err) throw err;
        else if(doc) {
            res.send(200, JSON.stringify(resultSet));
        } else {
            res.send(404, "Company not found by id=" + req.params.id);
        }
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
app.put('/companies/:id', function(req, res) {
    var parsedCompany = JSON.parse(req.body.company);

    var id = req.params.id;
    delete parsedCompany._id;

    if(!id) {
        res.send(400, "No id found, use post to save new company. Got params.id=" + id + " and body.company=" + req.body.company);
    } else {
        var company = new Company(parsedCompany);
        Company.findOneAndUpdate({_id : id}, parsedCompany, function(err, doc) {
            if(err) throw err;
            console.log("Update returned=" + doc);
            res.send(200, JSON.stringify(doc));
        });
    }
});

// ta bort ett företag
app.delete("/companies/:id", function(req, res) {
    var id = req.params.id;
    console.log("Delete company with id=" + id);
    if(!id) {
        res.send(400, "No id found, will not remove any companies");
    } else {
        Company.remove({_id: id}, function(err) {
            if(err) throw err;
            console.log("Removed company with id=" + id);
            res.send(200, "Removed company with id=" + id);
        });
    }
});

// ta bort företag som matchar patternet
// använd på egen risk :P
// pattern kan vara {"name":"Test1"}
app.delete("/companies", function(req, res) {
    console.log("Received delete pattern: " + req.body.pattern);
    var pattern = JSON.parse(req.body.pattern);

    if(!pattern) {
        res.send(400, "No pattern found, will not remove any companies");
    } else {
        Company.remove(pattern, function(err) {
            if(err) throw err;
            res.send(200, "Removed company with pattern: " + req.body.pattern);
        });
    }
});