var db = require('../middleware/db'),
    tables = require('../db_tables_config.json');

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
        res.render('login_page');
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
    db.get_table(tables.university_list)
        .then((result) => {return db.get_table(tables.faculties_list, result);})
        .then((result) => {res.render('admin', {data: JSON.stringify(result)});});
}
