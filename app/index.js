/**
 * Initial app bootstraping
 */

var express = require('express');
var path = require('path');
var app = express();
var apiRouter = require('./server/router/api.js')

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '/client/views'));

app.use(express.static('app/client/assets'));

app.use('/api/', apiRouter);


// Setting up global scope methods
// recommended: just logger, metrics and config
global.quantum = {}; // Namespace
global.quantum.logger = require('./plugins/logger.js');


module.exports = app;
