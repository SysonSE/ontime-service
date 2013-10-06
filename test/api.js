/* global describe:true, it:true*/
"use strict";
var request = require('superagent');
var expect = require('expect.js'); //expect-tyle assertions
var assert = require('assert'); //assert-style assertions
var app = require('../app');
var port = app.get('port');

describe('API tests', function(){
	describe('/ (root url)', function(){

		it('should return a 200 statuscode', function(done){
			request.get('localhost:'+port).end(function(res){
				assert.equal(200, res.status);
				done();
			});
		});

		it('should contain routes', function(done){
			request.get('localhost:'+port).end(function(res){
				expect(res).to.exist;
				var jsonResponse = JSON.stringify(res.text);
				expect(jsonResponse.routes).to.exist;
				done();
			});
		});
	});

	describe('/companies', function(){

		it('should return a 200 statuscode', function(done){
			request.get('localhost:'+port+'/companies').end(function(res){
				assert.equal(200, res.status);
				done();
			});
		});
	});
});


