"use strict";
var express = require('express'),
	db = require('./db'),
    config = require('config'),
    _ = require('underscore'),
    app = module.exports = express();

module.exports = express.basicAuth(function(user, pass, fn) {
	fakeDatabaseLookup(user, pass, fn);
});

function fakeDatabaseLookup(user, pass, fn){
	/*
		fn är en callback-function som vi behöver invokera för att tala om för 
		express att autentiseringen lyckades (true) eller misslyckades (false).
		Varför man passar in 'null' först är för att express använder konventionen 
		(liksom de flesta node-rameverk)
		att alla callbacks tar först ett error-argument (eller null om det inte existerar),
		följt av resten av argumenten. 
	*/
	if(user === 'jdog' && pass === 'hitler'){
		fn(null, true);
	} else {
		fn(null, false);
	}
}

module.exports = app.all('*', function(req, res, next){
    if(_.contains(config.allowedHosts, req.host)){

        console.log("auth.auth passed");
        next();
    } else {
        console.log('request from hostname: ' + req.host + ' not allowed.');
        res.json({
            success: false,
            message: 'Illegal host'
        });
        next(new Error(401));
    }
});
