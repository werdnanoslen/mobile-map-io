var mysql = require("mysql");
var secrets = require("./secrets.js");
var api = secrets.APIPATH;

function REST_ROUTER(router, connection) {
    var self = this;
    self.handleRoutes(router, connection);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection) {
    // Get API info
    router.get("/", function(req, res) {
        res.json({
            "Message": "This is the mobile-map-io API"
        });
    });

    // Get all reports
    router.get("/reports", function(req, res) {
        var query = "SELECT * FROM ??";
        var table = ["reports"];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query"
                });
            } else {
                res.json({
                    "Error": false,
                    "Message": "Success",
                    "Reports": rows
                });
            }
        });
    });

    // Get report by id
    router.get("/reports/:id", function(req, res) {
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["reports", "id", req.params.id];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query"
                });
            } else {
                res.json({
                    "Error": false,
                    "Message": "Success",
                    "Reports": rows
                });
            }
        });
    });

    // Add report
    router.post("/reports", function(req, res) {
        var query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
        var table = ["reports", "datetime_occurred", "number", "text", "place",
            req.body.date + " " + req.body.time, req.body.number, req.body.text, req.body.place
        ];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query"
                });
            } else {
                res.json({
                    "Error": false,
                    "Message": "Success",
                    "Reports": rows
                });
            }
        });
    });

    // Update report
    router.put("/reports", function(req, res) {
        var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
        var table = ["reports",
            "datetime_occurred", req.body.datetime,
            "number", req.body.number,
            "text", req.body.text,
            "place", req.body.place,
            "id", req.body.id
        ];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query"
                });
            } else {
                res.json({
                    "Error": false,
                    "Message": "Success",
                    "Reports": rows
                });
            }
        });
    });

    // Delete report by id
    router.delete("/reports/:id", function(req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["reports", "id", req.params.id];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query"
                });
            } else {
                res.json({
                    "Error": false,
                    "Message": "Deleted the report with id " + req.params.id
                });
            }
        });
    });
}

module.exports = REST_ROUTER;
