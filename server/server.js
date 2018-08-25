const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');

const connectToDB = require('./db').connect;
const router = require('./router');

const server = express();
let port;

// validate arguments, get port.
if (process.argv.length > 2) {
    port = process.argv[2];
} else {
    console.log("Usage: node server.js <port>");
    process.exit(1);
}

// serve favicon
let favIconPath = path.join(__dirname, '..', 'public', 'assets', 'img', 'favicon.png');
server.use(favicon(favIconPath));

// parse input data
server.use(express.json());

// serve static files from public dir
server.use(express.static(path.join(__dirname, '..', 'public')));

// routes for db api
server.use(router);

// listen
server.listen(port, () => {
    console.log('Listening on port ' + port);
    connectToDB().then(
        value => console.log(value),
        reason => {
            console.error(reason);
            process.exit(1);
        }
    );
});
