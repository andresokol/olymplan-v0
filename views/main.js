var db = require('../middleware/db');

exports.main_page = function (req, res) {
    //res.send("<h1>" + req.hostname + "</h1>" + "<p>" + JSON.stringify(req.route) + "</p>");
    res.render('main.ejs', {
        hostname: req.hostname,
        data: JSON.stringify(req.route)
    });
}

exports.university = function(req, res) {
    db.get_by_id("universities", req.params.id, function(result) {
        if (result == undefined) {
            res.send("something gone wrong");
        }
        else {
            res.send(result[0]);
        }
    });
}
