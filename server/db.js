/* API for database operations */
const mongo = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://localhost:27017/";
const DB_NAME = "app";
const COLLECTION_NAME = "users";

let db;

// connect to database + creates a collection for users if doesn't exist
function connect() {
    return new Promise( (resolve, reject) => {
        mongo.connect(MONGO_URL, { useNewUrlParser: true }, (err, client) => {
            if (err) reject(err);

            db = client.db(DB_NAME);

            db.createCollection(COLLECTION_NAME, (err, result) => {
                if (err) reject(err);

                resolve("Connected successfully to database");
            });
        });
    });
}

// find in collection
function find(data, projection) {
    let proj = projection || {};
    Object.assign(proj, { _id: 0 });

    return new Promise((resolve, reject) => {
        db.collection(COLLECTION_NAME)
        .findOne(data, { projection: proj }, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

 // insert a new doc to collection
function insert(item) {
    return new Promise( (resolve, reject) => {
        db.collection(COLLECTION_NAME).insertOne(item, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

 // update a doc in the collection
function update(query, newValues) {
    return new Promise( (resolve, reject) => {
        db.collection(COLLECTION_NAME).updateOne(query, { $set: newValues }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

// export for other modules to use
module.exports = {
    connect,
    find,
    insert,
    update
};