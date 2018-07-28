const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'students';
const USERS_COLLECTION = 'users';
let db;
 
// Use connect method to connect to the server
const dbOps = { 
    connect: function() {
        MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to DB");
        
        db = client.db(dbName);
        
        client.close();
        });
    },

    insertUser: function(data) {
        const collection = db.collection(USERS_COLLECTION);
        let doc;
        collection.findOne({user: data.user}, {}, (err, item) => {
            if (err) {
                console.log(err);
            }
            if (!item) {
                console.log("couldn't find any user like that");
                collection.insertOne(data);
            }
            console.log(item);
            doc = item;
        });
    }
}

module.exports = dbOps;