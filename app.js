"use strict";
var express = require('express'),
	http = require('http'),
	app = module.exports = express(),
	routes = require('./routes'),
	monk = require('monk'),
	db = monk('localhost:27017/time'),
	env = app.get('env'),
	config = require('config'),
	_ = require('underscore'),
	monk = require('monk'),
	db = monk('localhost:27017/time');

app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.methodOverride());

var auth = express.basicAuth(function(user, pass, fn) {
	fakeDatabaseLookup(user, pass, fn);
});

if (env === 'development') {
	app.use(express.errorHandler());
}

app.all('*', function(req, res, next){
	if(_.contains(config.allowedHosts, req.host)){
		next();
	} else {
		console.log('request from hostname: ' + req.host + ' not allowed.');
		next(new Error(401));
	}
});

app.get('/', routes.index);

app.get('/companies', routes.companies(db));

app.get('/companies/:orgnr', routes.companiesByOrgNr(db));

app.get('/secretArea', auth, routes.secretArea);

http.createServer(app).listen(app.get('port'), function(){
	console.log('OnTime service listening on port ' + app.get('port'));
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
