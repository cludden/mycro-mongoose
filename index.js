'use strict';

var asyncjs = require('async'),
    mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = {
    /**
     * Create a valid mongodb connection string
     *
     * @param {object} connectionInfo - connection info
     * @param {function} cb - callback
     * @private
     */
    _buildMongooseConnectionString: function(connectionInfo, cb) {
        var connectionString = 'mongodb://';

        if (connectionInfo.url) {
            return cb(null, connectionInfo.url);
        }

        // append credentials if provided
        if (connectionInfo.user && connectionInfo.password) {
            if (!connectionInfo.database) return cb('A database must be specified if credentials are being used');
            connectionString += connectionInfo.user + ':' + connectionInfo.password + '@';
        }

        // append host and port
        connectionString += connectionInfo.host + ':' + connectionInfo.port + '/';

        if (connectionInfo.database) {
            connectionString += connectionInfo.database;
        }

        cb(null, connectionString);
    },


    /**
     * Specify adapter defaults
     *
     * @param {object} _defaults
     */
    _defaults: {

    },


    /**
     * Expose the raw mongoose library required for this module
     *
     * @type {Object}
     */
    mongoose: mongoose,


    /**
     * Create a new mongoose connection with the specified connection info
     *
     * @param {object} connectionInfo - connection info from microbrial config
     * @param {function} cb - callback
     */
    registerConnection: function(connectionInfo, cb) {
        var mongoose = require('mongoose'),
            self = this,
            defaults = self._defaults;

        // get connection options, apply defaults
        _.defaults(connectionInfo, defaults);

        asyncjs.waterfall([
            function getConnectionString(fn) {
                return self._buildMongooseConnectionString(connectionInfo, fn);
            },

            function getConnection(url, fn) {
                var connection = mongoose.createConnection(url);
                connection.on('connected', function() {
                    return fn(null, connection);
                });
                connection.on('error', function(err) {
                    return fn(err);
                });
            }
        ], cb);
    },


    /**
     * Create a new mongoose model and return it to microbial
     *
     * @param {object} connection - a mongoose connection
     * @param {object} modelDefinition - a model definition
     * @param {object} modelDefinition.name - the model name
     * @param {object} modelDefinition.schema - a mongoose schema defintion
     * @param {object} [modelDefinition.methods={}] - instance methods
     * @param {object} [modelDefinition.statics={}] - class methods
     * @param {object} [modelDefinition.middleware={}] - model middleware declarations
     * @param {object} [modelDefinition.middleware.pre={}] - pre middleware
     * @param {object} [modelDefinition.middleware.post={}] - post middleware
     * @param {function} cb - callback
     */
    registerModel: function(connection, modelDefinition, cb) {
        try {
            var model = modelDefinition(connection, connection.base.Schema);
            return cb(null, model);
        } catch (err) {
            return cb('Error defining mongoose model (' + modelDefinition.__name + '): ' + err);
        }
    }
};
