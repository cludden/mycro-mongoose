'use strict';

var mongooseAdapter = require('../../../index');

module.exports = {
    first: {
        adapter: mongooseAdapter,
        config: {
            host: 'localhost',
            port: 27017,
            user: 'test',
            password: 'password',
            database: 'mycro-mongoose-first'
        },
        default: true
    },

    second: {
        adapter: mongooseAdapter,
        config: {
            host: 'localhost',
            port: 27017,
            user: 'test',
            password: 'password',
            database: 'mycro-mongoose-second'
        },
        models: [
            'blog/*'
        ]
    }
};
