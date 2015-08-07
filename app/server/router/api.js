/**
 * API subrouter goes here
 */
var router = require('express').Router();
var acCtrl = require('../controllers/api/access.js');

router.get('/wai/pally', acCtrl.pally);

module.exports = router;