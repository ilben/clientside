const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');

const server = express();
const port = 58008;

server.use(favicon(path.join(__dirname, '..', 'public', 'assets', 'img', 'favicon.png')));

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

server.use(express.static(path.join(__dirname, '..', 'public')));

server.listen(port, () => {
    console.log('Listening on port ' + port)
});
