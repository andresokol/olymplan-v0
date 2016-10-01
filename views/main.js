var db = require('../middleware/db'),
    utils = require('../middleware/utils');

exports.landing_page = function (req, res) {
    res.render('landing', {
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

exports.get_event = (req, res, next) => {
    if( isNaN(req.params.id) ) {
        next();
        return;
    }

    db.get_by_id("events", req.params.id, (result) => {
        //console.log(result);
        if (result == undefined) {
            res.send("something gone wrong");
        }
        else {
            res.render('event.ejs', {
                event_name: result.name,
                lvl: result.lvl,
                event_url: result.site_url,
                grade_range: utils.list_to_string_range(result.grade_range),
                description: result.description
            });
        }
    });
}

exports.get_event_list = (req, res, next) => {
    db.get_column_as_list('events', 'name', (result) => {
        if (result == undefined) {
            res.send('smth went wrong');
        }
        else {
            res.render('event_list.ejs', {
                event_list: result
            });
        }
    });
}
