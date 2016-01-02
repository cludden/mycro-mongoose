'use strict';

var expect = require('chai').expect;

describe('connections', function() {
    it('should create two connections', function() {
        expect(microservice.connections).to.have.keys('first', 'second');
    });
});
