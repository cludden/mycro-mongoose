/* jshint expr:true */
'use strict';

var asyncjs = require('async'),
    expect = require('chai').expect;

describe('blog-posts', function() {
    it('should be registered with the `second` connections', function() {
        expect(microservice.connections.second.connection.modelNames()).to.eql(['blog/post']);
    });

    it('should be available at `microservice.models[\'blog/post\']`', function() {
        expect(microservice.models['blog/post']).to.exist;
    });

    it('should behave like a native mongoose model', function(done) {
        var posts = microservice.models['blog/post'];
        asyncjs.auto({
            before: function(fn) {
                posts.count(function(err, count) {
                    expect(err).to.not.exist;
                    expect(count).to.be.a('number');
                    fn(err, count);
                });
            },
            create: ['before', function(fn) {
                posts.create({
                    title: 'test',
                    body: 'this is a test blog post'
                }, function(err, post) {
                    expect(err).to.not.exist;
                    expect(post.toJSON()).to.have.any.keys('title', 'body', '_id');
                    fn(err, post);
                });
            }],
            after: ['create', function(fn, r) {
                posts.count(function(err, count) {
                    expect(count).to.equal(r.before + 1);
                    fn(err, count);
                });
            }],
            update: ['after', function(fn, r) {
                posts.update({_id: r.create._id}, {title: 'new title'}, function(err, raw) {
                    expect(err).to.not.exist;
                    fn(err, raw);
                });
            }],
            verify: ['update', function(fn, r) {
                posts.findOne({_id: r.create._id}, function(err, post) {
                    expect(err).to.not.exist;
                    expect(post.title).to.equal('new title');
                    fn(err, post);
                });
            }],
            remove: ['verify', function(fn, r) {
                posts.remove({_id: r.create._id}, function(err) {
                    expect(err).to.not.exist;
                    fn(err);
                });
            }],
            final: ['remove', function(fn, r) {
                posts.count(function(err, count) {
                    expect(count).to.equal(r.before);
                    fn(err, count);
                });
            }]
        }, done);
    });
});
