/* global describe:true, it:true*/
"use strict";
var request = require('superagent');
var expect = require('expect.js'); //expect-tyle assertions
var assert = require('assert'); //assert-style assertions
var app = require('../app');
var port = app.get('port');
var rootUrl = 'localhost:'+port;

describe('API tests', function(){
	describe('/ (root url)', function(){

		it('should return a 200 statuscode', function(done){
			request.get(rootUrl).end(function(res){
				assert.equal(200, res.status);
				done();
			});
		});

		it('should contain routes', function(done){
			request.get(rootUrl).end(function(res){
				expect(res).to.exist;
				var jsonResponse = JSON.stringify(res.text);
				expect(jsonResponse.routes).to.exist;
				done();
			});
		});
	});

	describe('/companies', function(){

		it('should return a 200 statuscode', function(done){
			request.get(rootUrl+'/companies').end(function(res){
				assert.equal(200, res.status);
				done();
			});
		});
	});
});

describe('Authentication', function(){

	describe('Failing auth', function(){
		it('should fail when no credentials set', function(done){
			request.get(rootUrl+'/secretArea').end(function(res){
				expect(res.status).to.be(401);
				done();
			});
		});

		it('should fail when wrong credentials set', function(done){
			request.get(rootUrl+'/secretArea').auth('derp', 'flerp').end(function(res){
				expect(res.status).to.be(401);
				done();
			});
		});
	});

	describe('Successful auth', function(){
		it('should succeed with status code 200', function(done){
			request.get(rootUrl+'/secretArea').auth('jdog', 'hitler').end(function(res){
				expect(res.status).to.be(200);
				done();
			});
		});
	});

});


