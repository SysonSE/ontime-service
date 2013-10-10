"use strict";
var express = require('express'),
	app = module.exports = express(),
    User = require('./user');

app.post('/user', function(req, res) {
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

app.get('/users', function(req, res){
    console.log("getting some users...");
    User.find().exec(function(resultSet) {
        res.send(200, JSON.stringify(resultSet));
    });
});