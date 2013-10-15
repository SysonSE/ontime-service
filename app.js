"use strict";
var express = require('express'),
	http = require('http'),
	app = module.exports = express(),
	cors = require('cors'),
	env = app.get('env'),
	config = require('config'),
	_ = require('underscore'),
	db = require('./lib/db'),
	loginApi = require('./lib/login-api'),
	companyApi = require('./lib/company-api'),
	userApi = require('./lib/user-api'),
	passport = require('passport'),
	BasicStrategy = require('passport-http').BasicStrategy;

var corsOptionsDelegate = function(req, callback){
	var corsOptions;
	if(_.contains(config.allowedOrigins, req.header('Origin'))){
		corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
	}else{
		corsOptions = { origin: false }; // disable CORS for this request
	}
	callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate));

/* by placing this route before 
the auth rules it is not affected and 
therefor always accessible */
app.get('/', function(req, res){
    res.jsonp({
		greetings: 'Hello says the Ontime Service!'
    });
});

passport.use(new BasicStrategy(
	function(username, password, done) {
		return fakeDatabaseLookup(username, password, done);
	}
));

app.use(passport.initialize());
app.use(passport.authenticate('basic', { session: false }));


app.set('port', process.env.PORT || 3000);
app.use(express.methodOverride());
app.use(express.bodyParser());

if (env === 'development') {
	app.use(express.logger('dev'));
	app.use(express.errorHandler());
}

/* Mount subapplications */
app.use(loginApi);
app.use(companyApi);
app.use(userApi);

http.createServer(app).listen(app.get('port'), function(){
	console.log('OnTime service listening on port ' + app.get('port'));
});

function fakeDatabaseLookup(username, pass, fn){
	if(username === 'jdog' && pass === 'hitler'){
		var user = {
			name: 'derp',
			role: 'clerk'
		};
		return fn(null, user);
	} else {
		return fn(null, false);
	}
}
