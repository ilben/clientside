const mongo = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://localhost:27017/";
const DB_NAME = "app";
const COLLECTION_NAME = "users";

let db;

function connect() {
    mongo.connect(MONGO_URL, { useNewUrlParser: true }, (err, client) => {
        if (err) throw err;

        db = client.db(DB_NAME);

        db.createCollection(COLLECTION_NAME, (err, result) => {
            if (err) throw err;

            console.log("Connected successfully to database");
        });
    });
}

function find(data, projection) {
    let proj = projection || {};
    Object.assign(proj, { _id: 0 });

    return new Promise((resolve, reject) => {
        db.collection(COLLECTION_NAME).findOne(data, proj, (err, res) => {
            if (err) reject(err);

            resolve(res);
        });
    });
}

function insert(item) {
    db.collection(COLLECTION_NAME).insertOne(item, (err, res) => {
        if (err) throw err;
    });
}

function update(query, newValues) {
    return new Promise( (resolve, reject) => {
        db.collection(COLLECTION_NAME).updateOne(query, { $set: newValues }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

module.exports = {
    connect,
    find,
    insert,
    update
};