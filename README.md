# mycro-mongoose
a [mongoose.js](http://mongoosejs.com) adapter for [mycro](https://github.com/cludden/mycro)


## Install
```javascript
npm install --save mycro-mongoose
```


## Getting Started
First, make sure both the `connections` and `models` hooks are enabled. (These are enabled by default, however, if you've defined your own `/config/hooks.js` file, make sure it includes both of these)
```javascript
// in /config/hooks.js
module.exports = [
    // ..
    'connections',
    'models'
    // ..
]
```

Then, define one or more `mongoose` connections
```javascript
// in /config/connections.js

var mongooseAdapter = require('mycro-mongoose');

module.exports = {
    // ..
    mongo: {
        adapter: mongooseAdapter,
        config: {
            host: process.env.MONGO_HOST || 'localhost',
            port: process.env.MONGO_PORT || 27017,
            user: process.env.MONGO_USER,
            password: process.env.MONGO_PASSWORD,
            database: process.env.MONGO_DATABASE
        }
    },
    // ..
};
```


Next, define a mongoose model
```javascript
// in /app/models/post.js

module.exports = function(connection, Schema) {
    let options = {
        collection: 'posts'
    };

    let schema = new Schema({
          title:  String,
          author: {
              type: Schema.Types.ObjectId,
              ref: 'users'
          },
          body:   String,
          comments: [{
              body: String,
              date: Date
          }],
          date: {
              type: Date,
              default: Date.now
          },
          hidden: Boolean,
          meta: {
                votes: Number,
                favs:  Number
          }
    });

    return connection.model('post', blogSchema);
}
```


Lastly, use it in your app!
```javascript
// in /app/controllers/post.js

module.exports = {
    findPosts(req, res) {
        var Posts = req.mycro.models['post'];

        Posts.find({
            hidden: false,
            date: {
                $lte: new Date()
            }
        }, function(err, posts) {
            if (err) {
                return res.json(500, {error: err});
            }
            res.json(200, {data: posts});
        });
    }
}
```

## Config
The connection configuration object is described in more detail below
```javascript
// in config/connections.js
const mongooseAdapter = require('mycro-mongoose');

module.exports = {
    // ..
    mongo: {
        // in order to specify a mongodb connection, use this adapter as the adapter object
        adapter: mongooseAdapter,

        // all config is specified in the 'config' top level key. the key can be an object
        // or a synchronous function (executed at runtime) that is passed the mycro instance and expects
        // a config object in return
        config: {
            // either a valid mongodb url connection string can be provided
            url: 'mongodb://sampleuser:correct-horse-batter-staple@localhost:27017/test',

            // or the following are used to build a valid connection string
            host: 'localhost'
            port: 27017,
            user: 'sampleuser',
            password: 'correct-horse-batter-staple',
            database: 'test'

            // any additional connection options can be specified in an optional 'options' keys
            options: {
                replSet: {
                    sslValidate: false
                }
            }
        }
    }
    // ..
}
```

## Testing
running the tests:
1. Update the connection info in `test/test-app/config/connections.js`
2. Run the `mongod` server
3. `npm test`


to view coverage:  
1. Update the connection info in `test/test-app/config/connections.js`
2. Run the `mongod` server
3. `grunt coverage`


## Contributing
1. [Fork it](https://github.com/cludden/mycro-mongoose/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request


## License
Copyright (c) 2015 Chris Ludden.
Licensed under the [MIT license](LICENSE.md).
