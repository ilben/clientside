const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');

const server = express();
let port;

if (process.argv.length > 2) {
    port = process.argv[2];
} else {
    console.log("Usage: node server.js <port>");
    process.exit(1);
}

server.use(favicon(path.join(__dirname, '..', 'public', 'assets', 'img', 'favicon.png')));

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

server.use(express.static(path.join(__dirname, '..', 'public')));

server.listen(port, () => {
    console.log('Listening on port ' + port)
});
