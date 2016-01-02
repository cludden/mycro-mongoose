'use strict';

var expect = require('chai').expect;

describe('connections', function() {
    it('should create two connections', function() {
        expect(microservice.connections).to.have.keys('first', 'second');
    });

    describe('first', function() {
        it('should contain 2 models', function() {
            expect(microservice.connections.first.connection.modelNames()).to.have.lengthOf(2);
        });

        it('should contain the `user` model', function() {
            expect(microservice.connections.first.connection.modelNames()).to.contain('user');
        });

        it('should contain the `group` model', function() {
            expect(microservice.connections.first.connection.modelNames()).to.contain('group');
        });
    });

    describe('second', function() {
        it('should contain 1 model', function() {
            expect(microservice.connections.second.connection.modelNames()).to.have.lengthOf(1);
        });

        it('should contain the `blog/post` model', function() {
            expect(microservice.connections.second.connection.modelNames()).to.contain('blog/post');
        });
    });
});
