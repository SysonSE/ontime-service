"use strict";
var express = require('express'),
	app = module.exports = express(),
    auth = require('../auth'),
    mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;

//use authentication for this module
app.use(auth);

app.use(express.bodyParser());

var companySchema = new mongoose.Schema({
    name: String
});
var Company = mongoose.model('Company', companySchema);

app.get('/companies', function(req, res) {
    console.log("getting some companies...");
    Company.find({name: /.*/}).exec(function(resultSet) {
        res.send(200, JSON.stringify(resultSet));
    });
});

app.post('/companies', function(req, res) {
    var cParam = req.body.company

    console.log(cParam);

    if(!cParam) {
        res.send(400, "Required parameter 'company' is missing in request");
    } else if(cParam._id) {
        res.send(400, "Id already set, use PUT to update");
    } else {

        var company = new Company({
            name : cParam.name
        });
        console.log(company);

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

    Company.findOne({_id : req.params.id}, function(resultSet) {
        res.send(200, JSON.stringify(resultSet));
    });
});



