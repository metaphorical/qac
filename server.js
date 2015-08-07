var app = require('./app');
var pagesRouter = require('./app/server/router/pages.js');

var logger = global.quantum.logger;

// Routing pages
pagesRouter(app);
app.use(function (req, res, next) {
  logger.info('Time: %d', Date.now());
  next();
});

var server = app.listen(3392, function () {
    var host = server.address().address;
    var port = server.address().port;
    logger.info('App listening at http://%s:%s', host, port);
});
