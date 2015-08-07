var http = require('http');
var https = require('https');
var url = require('url');

var logger = global.quantum.logger;


/**
 * Metod to manage api requests
 * @param {Object}   options  Options for nodejs http requests
 * @param {Function} callback executed on success or error
 * @param {bool}   expose   Flag to expose request object (to be able to write a body of request)
 */
var apiCall = function(options, callback, write) {
    logger.info('API request to ' + url.format(options));
    // setup protocol based on passed parameters
    var protocol = (options.port && options.port === '443') ? https : http;
    try {
        var req = protocol.request(options, function(res) {
            var responseString = '';
            res.setEncoding('utf8');

            // concatinating the chunks
            res.on('data', function (chunk) {
                responseString += chunk;
            })

            // End usually means it was success
            .on('end', function() {
                // Build specific code handling here
                if (res.statusCode >= 400 && res.statusCode <= 500 ) {
                    var errorObject = {
                        statusCode : res.statusCode,
                        error: 'API error happened',
                        output: responseString
                    };
                    logger.error('Error happened');
                    logger.error(errorObject);
                    callback(errorObject, null);
                } else {
                    logger.info('Request successful');
                    callback(null, responseString);
                }


            })

            .on('error', function(err) {
                logger.error('Error happened');
                logger.error(err);
                callback(err, null);
            });
        });

        if (write) {
            return req;
        } else {
            req.end();
        }

    } catch (e) {
        logger.error('Error happened');
        logger.error(e);
    }

};

module.exports = apiCall;
