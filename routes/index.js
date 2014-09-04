var fs = require('fs');
var c = require('../config').config;  // App configuration


/*
 * GET home page.
 */
exports.index = function(req, res){
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

        res.render('index', model);
     });
};