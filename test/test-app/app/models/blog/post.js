'use strict';

var validator = require('validator'),
    _ = require('lodash');

module.exports = function(connection) {
    var Schema = connection.base.Schema;

    var options = {
        collection: 'blog-posts'
    };

    var schema = new Schema({
        title: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        body: {
            type: String
        }
    }, options);

    return connection.model('blog/post', schema);
};
