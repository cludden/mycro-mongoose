# resetify-microservice-mongoose
a [mongoose.js](http://mongoosejs.com) adapter for [restify-microservice](https://github.com/cludden/restify-microservice)


## Install
```javascript
npm install --save restify-microservice-mongoose
```


## Getting Started
First, define one or more `mongoose` connections
```javascript
// in /config/connections.js

var mongooseAdapter = require('resetify-microservice-mongoose');

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
    var blogSchema = new Schema({
          title:  String,
          author: String,
          body:   String,
          comments: [{ body: String, date: Date }],
          date: { type: Date, default: Date.now },
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
    findPosts: function(req, res) {
        var microservice = req.microservice;
            Posts = microservice.models['post'];

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
