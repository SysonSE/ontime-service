"use strict";
var express = require('express'),
	app = module.exports = express(),
	auth = require('../auth'),
	mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
    name: String,
    age: Number
});
var User = mongoose.model('User', userSchema);

app.get('/user', auth, function(req, res) {
    var user = new User({
        name: 'Alex',
        age: 54
    });

    user.save(function (err) {
        if (err) {
            console.log('error saving ' + name);
            res.send('error');
        }
        res.send('saved!');
    });
});