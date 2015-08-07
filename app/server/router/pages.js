var homeCtrl = require('../controllers/pages/home.js');

var pageRouter = function(app) {

    app.get('/', homeCtrl.getHome);

};

module.exports = pageRouter;
