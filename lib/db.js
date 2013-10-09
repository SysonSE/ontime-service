"use strict";
var mongoose = require('mongoose'),
	config = require('config'),
	db;

mongoose.connect(config.dbUri);
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('successfully connected to database: ' + config.dbUri);
});