"use strict";
var express = require('express'),
	app = module.exports = express();

app.get('/companies', function(req, res) {
    res.send(200);
});

app.get('/companies/:orgnr', function(req, res) {
    res.send(200);
});