var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var rest = require("./rest.js");
var app  = express();
var secrets = require("./secrets.js");

function REST(){
    var self = this;
    self.connectMysql();
};

// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
};

REST.prototype.connectMysql = function() {
    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 100,
        host     : secrets.HOSTNAME,
        user     : secrets.USERNAME,
        password : secrets.PASSWORD,
        database : secrets.DATABASE,
        debug    : false
    });
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);
        }
    });
}

REST.prototype.configureExpress = function(connection) {
    var self = this;
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    var router = express.Router();
    app.use(allowCrossDomain);
    app.use(secrets.APIPATH, router);
    var rest_router = new rest(router,connection);
    self.startServer();
}

REST.prototype.startServer = function() {
    app.listen(secrets.PORT, function(){
      console.log("mobile-map-io API running at port " + secrets.PORT);
    });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new REST();
