'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

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

    it('should allow for additional connection options to be specified at config.options', function(done) {
        var adapter = require('../../index');
        var config = {
            url: 'mongodb://localhost:27017/test',
            options: {
                replSet: {
                    sslValidate: false
                }
            }
        }
        sinon.stub(adapter.mongoose, 'createConnection').yieldsAsync();
        adapter.registerConnection(config, function(err) {
            expect(err).to.not.exist;
            expect(adapter.mongoose.createConnection.args[0][0]);
            expect(adapter.mongoose.createConnection.args[0][1]).to.be.an('object')
            .with.property('replSet').that.is.an('object').with.property('sslValidate', config.options.replSet.sslValidate);
            done(err);
        });
    });
});
