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

/* Mount subapplications */
app.use(loginApi);
app.use(companyApi);
app.use(userApi);

app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.methodOverride());

if (env === 'development') {
	app.use(express.errorHandler());
}

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

app.get('/', function(req, res){
    res.send(JSON.stringify({
        routes: {
            GET: app.routes['get'],
            POST: app.routes['post'],
            PUT: app.routes['put'],
            DELETE: app.routes['delete']
        }
    }));
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('OnTime service listening on port ' + app.get('port'));
});

