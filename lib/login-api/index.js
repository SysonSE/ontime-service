"use strict";
var express = require('express'),
	app = module.exports = express();

app.post('/login', function(req, res) {
    res.jsonp(200, {
        success: true,
        message: 'Login successful!'
    });
});