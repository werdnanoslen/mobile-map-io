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
            if (rows.length < 1) {
                res.status(404).json({
                    "error": 'no reports'
                });
            } else if (err) {
                res.status(500).json({
                    "error": err,
                });
            } else {
                res.json({
                    "reports": rows
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
            if (rows.length < 1) {
                res.status(404).json({
                    "error": 'report does not exist'
                });
            } else if (err) {
                res.status(500).json({
                    "error": err,
                });
            } else {
                res.json({
                    "report": rows
                });
            }
        });
    });

    // Add report
    router.post("/reports", function(req, res) {
        var query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
        var report = req.body.reportJson;
        var table = ["reports", "datetime_occurred", "number", "text", "place",
            report.datetime, report.number, report.text, report.place
        ];
        console.log(req.body);
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.status(500).json({
                    "error": err,
                });
            } else {
                res.json({
                    "report": rows
                });
            }
        });
    });

    // Update report
    router.put("/reports", function(req, res) {
        var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
        var report = req.body.reportJson;
        var table = ["reports",
            "datetime_occurred", report.datetime,
            "number", report.number,
            "text", report.text,
            "place", report.place,
            "id", report.id
        ];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.status(500).json({
                    "error": err,
                });
            } else {
                res.json({
                    "report": rows
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
                res.status(500).json({
                    "error": err,
                });
            } else {
                res.json({
                    "report": rows
                });
            }
        });
    });
}

module.exports = REST_ROUTER;
