var db = require('../middleware/db');

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
        res.send("Login required!");
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
    db.get_universities_as_table().then((result) => {
        res.render('admin', {data: {universities: result}});
    }).catch(console.log);
}
