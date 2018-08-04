const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');

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

// serve index
server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// serve static files from public dir
server.use(express.static(path.join(__dirname, '..', 'public')));

// listen
server.listen(port, () => {
    console.log('Listening on port ' + port)
});
