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
 * GET login page.
 */
exports.login = function(req, res) {
    var model = {
        debug : (req.query.debug) ? true : false,
        title : 'Login'
    };

    res.render('login', model);
};


/*
 * GET shopping page.
 */
exports.shop = function(req, res) {
    var model = {
        debug : (req.query.debug) ? true : false,
        username : null,
        title : 'Book Inventory',
        books : []
    };

    var sess = req.session;
    if (req.body.txtEmail) {
        sess.email = req.body.txtEmail;
        model.username = req.body.txtEmail;
    }
    

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
    var sess = req.session;

    var model = {
        debug : (req.query.debug) ? true : false,
        username : req.session.email,
        title : 'Payment'
    };

    res.render('payment', model);
};

/*
 * POST confirmation page.
 */
exports.confirmation = function(req, res) {
    var sess = req.session;

    var model = {
        debug : (req.query.debug) ? true : false,
        username : req.session.email,
        title : 'Confirmation',
        paymentDetails : req.body
    };

    if (!model.paymentDetails.inputAddress2 || model.paymentDetails.inputAddress2.length == 0) { 
        model.paymentDetails.inputAddress2 = false;
    }

    model.paymentDetails.inputCreditCard = 'XXXX-XXXX-XXXX-' + req.body.inputCreditCard.substring(req.body.inputCreditCard.length - 4);

    res.render('confirmation', model);
};