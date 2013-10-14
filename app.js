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
	LocalStrategy = require('passport-local').Strategy;;



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

/*
passport.use(new LocalStrategy(function(username, password, done) {
	console.log(username + ' ' + password);
	if(username != 'derp')
		return done('error');

	var user = {
		derp: 'flerp'
	};
	return done(null, user);
}));
*/

/*app.use(passport.initialize());
app.use(ensureAuthenticated);
*/


/*app.use(express.basicAuth(function(user, pass, fn) {
	fakeDatabaseLookup(user, pass, fn);
}));*/

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

/*function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next(); 
	}
	res.send(403);
}*/

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
