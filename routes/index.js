var fs = require('fs');
var c = require('../config').config;  // App configuration
var models = require('../models');
var moment = require('moment');
var MongoClient = require('mongodb').MongoClient;
var numeral = require('numeral');
var _ = require('lodash');

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
 * POST save creds, redirect to target page.
 */
exports.auth = function(req, res) {
    var sess = req.session;
    if (req.body.txtEmail) {
        sess.email = req.body.txtEmail;
        sess.credentialsHash = new Buffer(req.body.txtEmail + ':' + req.body.txtPassword).toString('base64');
    } 
    if (sess.targetUrl) {
        res.redirect(sess.targetUrl);
    } else {
        res.redirect('/');    
    }    
}


/*
 * GET remove creds, log the user out
 */
exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/');    
}


/*
 * GET shopping page.
 */
exports.shop = function(req, res) {
    var sess = req.session;

    var model = {
        debug : (req.query.debug) ? true : false,
        username : req.session.email,
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
    var sess = req.session;

    var model = {
        debug : (req.query.debug) ? true : false,
        username : req.session.email,
        title : 'Payment',
        states : []
    };

    fs.readFile(c.statesFile, 'utf8', function (err, data) {
        if (err) {
            console.error('Error: ' + err);
        } else {
            model.states = JSON.parse(data);
        }

        res.render('payment', model);
     });
};

/*
 * POST confirmation page.
 */
exports.confirmation = function(req, res) {
    var sess = req.session;

    var model = {
        debug : (req.query.debug) ? true : false,
        title : 'Confirmation',
        username : req.session.email,
        summary : {},
        orders : []
    };

    var cart = mapCart(sess, req.body);
    model.summary = cart;

    var orders = [];
    orders.push(cart)
    model.orders = massageOrders(orders);

    MongoClient.connect(buildMongoUrl(), function(err, db) {
        if(err) throw err;

        var collection = db.collection(c.db.collection);
        collection.insert(cart, function(err, docs) {
            db.close();
        });

    });

    res.render('confirmation', model);
};

/*
 * GET the list of previous orders. 
 */
exports.orders = function(req, res) {
    var sess = req.session;

    var model = {
        debug : (req.query.debug) ? true : false,
        title : 'Orders',
        username : req.session.email,
        orders : []
    };

    MongoClient.connect(buildMongoUrl(), function(err, db) {
        if(err) throw err;

        var query = { credentialsHash : sess.credentialsHash };
        var collection = db
            .collection(c.db.collection)
            .find(query)
            .limit(10)
            .toArray(function(err, orders) {
                model.orders = massageOrders(orders);
                res.render('orders', model);
                db.close();
            });
    });
}

/*
 * Map the form/data to a common model. 
 */
 function mapCart(session, formBody) {
    var cart = models.shoppingCart();
    cart.credentialsHash = session.credentialsHash;
    cart.email = session.email;
    cart.purchaseDate = moment().unix();
    cart.purchaseDateDisplay = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
    cart.items = JSON.parse(formBody.inputCart);
    cart.address.name.first = formBody.inputFirstName;
    cart.address.name.last = formBody.inputLastName;
    cart.address.street1 = formBody.inputAddress1;
    cart.address.street2 = formBody.inputAddress2;

    if (!cart.address.street2 || cart.address.street2.length == 0) {
        cart.address.street2 = null;
    }

    cart.address.city = formBody.inputCity;
    cart.address.state = formBody.selectState;
    cart.address.zip = formBody.inputZip;
    cart.payment.creditCard.number = 'XXXX-XXXX-XXXX-' + formBody.inputCreditCard.substring(formBody.inputCreditCard.length - 4);
    cart.payment.creditCard.expiration = formBody.inputExpiration;
    cart.payment.creditCard.ccv = formBody.inputCCV;

    return cart;
 }

/*
 * Add calculations to an array of orders.
 */
function massageOrders(orders) {
    var CURRENCY_FORMAT = '$0,0.00';
    
    _.each(orders, function(order) {
        order.total = 0;

        _.each(order.items, function(item) {
            item.subTotal = item.price * item.quantity;
            order.total += item.subTotal;
            item.price = numeral(item.price).format(CURRENCY_FORMAT);
            item.subTotal = numeral(item.subTotal).format(CURRENCY_FORMAT);                        
        });                    

        order.total = numeral(order.total).format(CURRENCY_FORMAT);
    });

    return orders;
}

/*
 * Build up the URL string to connect to the MongoDB instance. 
 */
function buildMongoUrl() {
    var mongoUrl = 'mongodb://' + c.db.username + ':' + c.db.password + '@' + c.db.host + ':' + c.db.port + '/' + c.db.database + '?auto_reconnect=true&safe=true';
    return mongoUrl;
 }