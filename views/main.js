exports.main_page = function (req, res) {
    //res.send("<h1>" + req.hostname + "</h1>" + "<p>" + JSON.stringify(req.route) + "</p>");
    res.render('main.ejs', {
        hostname: req.hostname,
        data: JSON.stringify(req.route)
    });
}
