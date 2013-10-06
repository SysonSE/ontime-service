/* global describe:true, it:true */
"use strict";
var request = require('superagent');
var expect = require('expect.js'); //expect-tyle assertions
var assert = require("assert"); //assert-style assertions

describe('API test suite 1', function(){
	describe('root of domain (/)', function(){

		it('should return a 200 statuscode', function(done){
			request.get('localhost:3000').end(function(res){
				assert.equal(200, res.status);
				done();
			});
		});

		it('should return a json-object describing the service', function(done){
			request.get('localhost:3000').end(function(res){
				expect(res).to.exist;
				expect(res.text).to.contain('ontime');
				done();
			});
		});
	});
});
