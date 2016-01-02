'use strict';

var validator = require('validator'),
    _ = require('lodash');

module.exports = function(connection) {
    var Schema = connection.base.Schema;

    var options = {
        collection: 'groups'
    };

    var schema = new Schema({
        name: {
            type: String,
            unique: true
        },
        desc: {
            type: String
        },
        users: [{
            type: Schema.Types.ObjectId,
            ref: 'user'
        }]
    }, options);

    return connection.model('group', schema);
};
