var db = require('../middleware/db');

exports.main_page = function (req, res) {
    res.render('main.ejs', {
        hostname: req.hostname,
        data: JSON.stringify(req.route)
    });
}

exports.university = function(req, res) {
    db.get_by_id("universities", req.params.id, (result) => {
        if (result == undefined) {
            res.send("something gone wrong");
        }
        else {
            res.send(result[0]);
        }
    });
}
