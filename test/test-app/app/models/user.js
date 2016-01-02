'use strict';

var validator = require('validator'),
    _ = require('lodash');

module.exports = function(connection) {
    var Schema = connection.base.Schema;

    var options = {
        collection: 'users'
    };

    var schema = new Schema({
        first: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        last: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
            validate: {
                validator: function(value) {
                    return validator.isEmail(value);
                }
            }
        },
        password: {
            type: String,
            required: true,
        }
    }, options);

    return connection.model('user', schema);
};
