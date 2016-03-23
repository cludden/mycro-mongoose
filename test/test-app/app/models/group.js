'use strict';

var validator = require('validator'),
    _ = require('lodash');

module.exports = function(connection, Schema, name, mycro) {
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

    schema.statics.log = function() {
        var args = [];
        for (var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        mycro.log.apply(null, args);
    };

    return connection.model(name, schema);
};
