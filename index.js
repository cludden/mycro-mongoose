'use strict';

var async = require('async'),
    _ = require('lodash');

module.exports = {
    /**
     * Specify adapter defaults
     *
     * @param {object} _defaults
     */
    _defaults: {

    },


    /**
     * Create a new mongoose instance with the specified connection info
     *
     * @param {object} connectionInfo - connection info from microbrial config
     * @param {function} cb - callback
     */
    registerConnection: function(connectionInfo, cb) {
        var mongoose = require('mongoose'),
            self = this,
            defaults = self._defaults;

        // get connection options, apply defaults
        connectionInfo.options = connectionInfo.options || {};
        _.defaults(connectionInfo.options, defaults);

        async.waterfall([
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
        var model;
        try {
            // validate `modelDefinition`
            if (!modelDefinition.schema) return cb('Invalid modelDefinition');
            var mongoose = require('mongoose');

            // define new schema
            var schema = new mongoose.Schema(modelDefinition.schema, modelDefinition.schemaOptions || {});

            // attach instance methods
            if (modelDefinition.methods) {
                schema.method(modelDefinition.methods);
            }

            // attach class methods
            if (modelDefinition.statics) {
                schema.method(modelDefinition.statics);
            }

            // virtuals
            if (modelDefinition.virtuals) {
                _.forEach(modelDefinition.virtuals, function(gettersAndSetters, name) {
                    if (gettersAndSetters.get) schema.virtual(name).get(gettersAndSetters.get);
                    if (gettersAndSetters.set) schema.virtual(name).set(gettersAndSetters.set);
                })
            }

            // middleware
            if (modelDefinition.middleware) {
                var middlewareTypes = ['pre', 'post'];
                middlewareTypes.forEach(function(type) {
                    if (modelDefinition.middleware[type]) {
                        _.forEach(modelDefinition.middleware[type], function(middleware, event) {
                            schema.pre(event, middleware);
                        });
                    }
                });
            }

            // build the model
            model = connection.model(modelDefinition.name, schema);
        } catch (err) {
            return cb('Error defining mongoose model: ' + err);
        }
        cb(null, model);
    },


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
    }
};