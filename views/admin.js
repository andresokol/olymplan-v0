const db = require('../middleware/db'),
    tables = require('../db_tables_config.json'),
    crypto = require('crypto'),
    kek = console.log;

exports.validate_admin_rights = (req, res, next) => {
    if (req.session.is_admin == true) {
        next();
        return;
    }
    if (req.session.is_admin == false) {
        res.send("Unauthorized access forbidden");
        return;
    }
    if (req.session.username == undefined) {
        res.redirect('/user/login?r=' + "/admin");  // FIXME: get request adress
        return;
    }

    db.validate_admin_rights(req.session.username)
            .then(() => {
                req.session.is_admin = true;
                next();
            }).catch(() => {
                req.session.is_admin = false;
                res.send("Unauthorized access forbidden");
            });
}

exports.main = (req, res) => {
    db.get_table(tables.event_list).then(function (result) {
        db.get_table(tables.user_list, result).then(function (result) {
            res.render('admin/main', {
                events : result[0],
                users : result[1]
                //код, который парсит JSON
            });
        });
    });
};
