/* jshint expr:true */
'use strict';

var asyncjs = require('async'),
    expect = require('chai').expect,
    sinon = require('sinon');

describe('users', function() {
    it('should be registered with the `first` connection', function() {
        expect(microservice.connections.first.connection.modelNames()).to.contain('group');
    });

    it('should be available at `microservice.models[\'user\']`', function() {
        expect(microservice.models['user']).to.exist;
    });

    it('should behave like a native mongoose model', function(done) {
        var users = microservice.models['user'];
        asyncjs.auto({
            before: function(fn) {
                users.count(function(err, count) {
                    expect(err).to.not.exist;
                    expect(count).to.be.a('number');
                    fn(err, count);
                });
            },
            create: ['before', function(fn) {
                users.create({
                    first: 'Harry',
                    last: 'Potter',
                    email: 'hpotter@hogwarts.com'
                }, function(err, user) {
                    expect(err).to.not.exist;
                    expect(user.toJSON()).to.have.any.keys('first', 'last', 'email', '_id');
                    fn(err, user);
                });
            }],
            after: ['create', function(fn, r) {
                users.count(function(err, count) {
                    expect(count).to.equal(r.before + 1);
                    fn(err, count);
                });
            }],
            update: ['after', function(fn, r) {
                users.update({_id: r.create._id}, {first: 'dave'}, function(err, raw) {
                    expect(err).to.not.exist;
                    fn(err, raw);
                });
            }],
            verify: ['update', function(fn, r) {
                users.findOne({_id: r.create._id}, function(err, user) {
                    expect(err).to.not.exist;
                    expect(user.first).to.equal('dave');
                    fn(err, user);
                });
            }],
            remove: ['verify', function(fn, r) {
                users.remove({_id: r.create._id}, function(err) {
                    expect(err).to.not.exist;
                    fn(err);
                });
            }],
            final: ['remove', function(fn, r) {
                users.count(function(err, count) {
                    expect(count).to.equal(r.before);
                    fn(err, count);
                });
            }]
        }, done);
    });

    it('should allow models to access the mycro instance', function() {
        sinon.spy(microservice, 'log');
        microservice.log('silly', 'test');
        expect(microservice.log).to.have.been.called;
        microservice.log.restore();
    });
});
