var fs = require('fs');
var c = require('../config').config;  // App configuration


/*
 * GET index/home page.
 */
exports.index = function(req, res) {
    var model = {
        debug : (req.query.debug) ? true : false,
        title : 'Welcome'
    };

    res.render('index', model);
};

/*
 * GET shopping page.
 */
exports.shop = function(req, res) {
    var model = {
        debug : (req.query.debug) ? true : false,
        title : 'Book Inventory',
        books : []
    };

    fs.readFile(c.inventoryFile, 'utf8', function (err, data) {
        if (err) {
            console.error('Error: ' + err);
        } else {
            model.books = JSON.parse(data).books;
        }

        res.render('shop', model);
     });
};

/*
 * GET payment page.
 */
exports.payment = function(req, res) {
    var model = {
        debug : (req.query.debug) ? true : false,
        title : 'Payment'
    };

    res.render('payment', model);
};

/*
 * GET confirmation page.
 */
exports.confirmation = function(req, res) {
    var model = {
        debug : (req.query.debug) ? true : false,
        title : 'Confirmation'
    };

    res.render('confirmation', model);
};