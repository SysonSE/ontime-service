"use strict";
var express = require('express'),
	app = module.exports = express(),
	auth = require('../auth');

app.get('/login', auth, function(req, res) {
    res.json(200, {
        success: true,
        message: 'Login successful!'
    });
});