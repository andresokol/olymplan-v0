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
      res.render('admin/main', {
        data : result[0]
        //код, который парсит JSON
      });
    });
}
