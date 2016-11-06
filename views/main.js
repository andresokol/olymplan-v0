var db = require('../middleware/db'),
    utils = require('../middleware/utils'),
    tables = require('../db_tables_config.json');

exports.landing_page = function (req, res) {
    res.render('landing', {
        hostname: req.hostname,
        data: JSON.stringify(req.route)
    });
}

exports.university = function(req, res) {
    db.getById("universities", req.params.id, (result) => {
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

    db.getById(tables.event_list, req.params.id, (result) => {
        //console.log(result);
        if (result == undefined) {
            res.send("something gone wrong");
        }
        else {
            db.getById(tables.stage_list, result[0].id, (result2) => {
                console.log(result2);
                res.render('event.ejs', {
                    event_name: result2[0].name,
                    lvl: result2[0].lvl,
                    event_url: result2[0].site_url,
                    grade_range: utils.listToStringRange(result2[0].grade_range),
                    description: result2[0].description,
                    stages: result2[1]
                });
            }, result);
        }
    });
}

exports.get_event_list = (req, res, next) => {
    db.getEventsForList((result) => {
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
