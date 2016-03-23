/* jshint expr:true */
'use strict';

var expect = require('chai').expect;

before(function() {
    process.chdir(__dirname + '/test-app');
});


describe('basic tests', function() {
    it('should start without error', function(done) {
        var Microservice = require('mycro'),
            microservice = new Microservice();
        global.microservice = microservice;

        microservice.start(function(err) {
            expect(err).to.not.exist;
            done(err);
        });
    });
});
