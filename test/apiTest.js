/* global describe:true, it:true*/
"use strict";
var request = require('supertest'),
	expect = require('expect.js'),
	app = require('../app'),
	username = 'jdog',
	password = 'hitler';

describe('API tests', function(){
	describe('/ (root url)', function(){

		it('should return a 200 statuscode', function(done){
			request(app).get('/').expect(200, done);
		});

		it('should contain routes', function(done){
			request(app).get('/').expect(200).end(function(err, res){
				expect(JSON.parse(res.text).routes).to.be.ok();
				done();
			});
		});
	});

	describe('/companies', function(){

		it('should return a 200 statuscode', function(done){
			request(app).get('/companies').expect(200, done);
		});
	});

	describe('/user', function(){

		it('should save a user', function(done){
			request(app).get('/user').auth(username, password).expect(200, done);
		});
	});
});

describe('Authentication', function(){

	describe('Failing auth', function(){
		it('should fail when no credentials set', function(done){
			request(app).get('/login').expect(401, done);
		});

		it('should fail when wrong credentials set', function(done){
			request(app).get('/login').auth('derp', 'flerp').expect(401, done);
		});
	});

	describe('Successful auth', function(){
		it('should succeed with status code 200', function(done){
			request(app).get('/login').auth(username, password).expect(200, done);
		});
	});

});


