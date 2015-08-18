'use strict';

var pa11y = require('pa11y');
var _ = require('lodash');
var logger = require('../../../plugins/logger.js');
var Promise = require('bluebird');

var specs = ['WCAG2A', 'WCAG2AA', 'WCAG2AAA'];

/**
 * Pa11y specific exception constructor
 * @param err
 * @returns {{error: *, name: string}}
 * @constructor
 */
var Pa11yException = function (err) {
    return {
        error: err,
        name: "pa11y exception"
    };
};

/**
 * Execute Pa11y test based on passed params
 * @param params Object containing url and additional pa11y options
 * @param callback Callback receiving test results in JSON
 */
var executePa11y = function(params, callback) {
    pa11y(params.options, function (error, test, exit) {
        if (error) {
            console.log('Error', error)
            throw new Pa11yException(error);
        }
        test(params.url, function (err, results) {
            if (err) {
                throw new Pa11yException(err);
            }
            //Exit phantom.js
            exit();
            //do what you want with results of test (they are in JSON)
            callback(results);
        });
    });
};

var testForStandardsSet = function(paramsSet, callback) {
    var testPromises = [];
    _.each(paramsSet, function(params) {
        testPromises.push(new Promise (function(resolve, reject) {
            executePa11y(params, function(results) {
                resolve(results);
            })
        }));

        var testsDone = Promise.all(testPromises);

        testsDone.then(function(values) {
            var accumulatedResults = [];
            if(values.length === testPromises.length) {
                _.each(values, function(val) {
                    accumulatedResults = accumulatedResults.concat(val);
                });
                callback(accumulatedResults);
            }

        });
    });
};

module.exports = {
    pally: function (req, res) {
        logger.info('Executing pa11y accessibility test on %s', req.query.address);

        var createParams = function (std) {
            var options = {};

            //If user passed user and pass for their server auth, we need ot set it up in pa11y opts
            if (req.query.username && req.query.password) {
                options = {
                    page: {
                        settings: {
                            userName: req.query.username,
                            password: req.query.password
                        }
                    }
                };
            }

            var url = req.query.address;

            options.standard = std;
            options.phantom ={};

            //Phantom port needs to be different for all three tests we are doing (a, aa and aaa standards)
            if (/A{3}$/g.test(std)) {
                options.phantom.port = 12301;
            } else if (/A{2}$/g.test(std)) {
                options.phantom.port = 12302;
            } else if (/A$/g.test(std)) {
                options.phantom.port = 12303;
            } else {
                options.phantom.port = 12304;
            }
            return {
                options: options,
                    url: url
            };
        };

        var paramsSet = [];
        _.each(specs, function(standard) {
            paramsSet.push(createParams(standard));
        });

        testForStandardsSet(paramsSet, function (results) {
            logger.info('Pa11y test done.');
            res.json(results);
        });
    }
};