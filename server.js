var fs = require('fs');  
var path = require('path');
var express = require('express');  
var session = require('express-session')
var bodyParser = require('body-parser');
var compress = require('compression');
var cookieParser = require('cookie-parser');
var uuid = require('node-uuid');

var routes = require('./routes');
var c = require('./config').config;  // App configuration

var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');


/*
 * Init Express
 */
var app = express();
app.set('port', process.env.PORT || c.appPort);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(session({
  genid: function(req) {
    return uuid.v4(); // use UUIDs for session IDs
  }
  , secret: uuid.v4()
  , secret: 'keyboard cat'
  , resave : true
  , saveUninitialized : true
}));
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser('foo'));

/*
 * Define routes.
 */
app.use(c.appPath, express.static(path.join(__dirname, 'public')));
app.get(c.appPath, routes.index);  
app.get(c.appPath + '/login', routes.login);  
app.post(c.appPath + '/shop', routes.shop);
app.get(c.appPath + '/shop', routes.shop);  
app.get(c.appPath + '/payment', routes.payment);  
app.post(c.appPath + '/confirmation', routes.confirmation);

/*
 * Fire up the server. 
 */
app.listen(app.get('port'));
console.log('Server started on port ' + app.get('port') + '. \nTry this: http://localhost:' + app.get('port') + c.appPath);
