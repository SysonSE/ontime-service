"use strict";
var express = require('express'),
	http = require('http'),
	app = module.exports = express(),
	env = app.get('env'),
	config = require('config'),
	_ = require('underscore'),
	db = require('./lib/db'),
	loginApi = require('./lib/login-api'),
	companyApi = require('./lib/company-api'),
	userApi = require('./lib/user-api');

/* by placing this route before 
the auth rules it is not affected and 
therefor always accessible */
app.get('/', function(req, res){
    res.send('Hello says the Ontime Service.');
});

app.all('*', function(req, res, next){
	if(_.contains(config.allowedHosts, req.host)){
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

app.use(express.basicAuth(function(user, pass, fn) {
	fakeDatabaseLookup(user, pass, fn);
}));

app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.bodyParser());

if (env === 'development') {
	app.use(express.errorHandler());
}

/* Mount subapplications */
app.use(loginApi);
app.use(companyApi);
app.use(userApi);

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
