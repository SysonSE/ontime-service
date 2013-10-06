var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var routes = require('./routes');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/time');
var env = app.get('env');
var config = require('./config.json');
var	_ = require('underscore');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/time');

app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.methodOverride());

if (env === 'development') {
  app.use(express.errorHandler());
}

app.all('*', function(req, res, next){
	if(_.contains(config.allowedHosts[env], req.host)){
		next();
	} else {
		console.log('request from hostname: ' + req.host + ' not allowed.');
		next(new Error(401));
	}
});

app.get('/', routes.index);

app.get('/companies', routes.companies(db));

app.get('/companies/:orgnr', routes.companiesByOrgNr(db));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
