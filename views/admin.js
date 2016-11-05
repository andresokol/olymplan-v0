const db = require('../middleware/db'),
    tables = require('../db_tables_config.json'),
    utils = require('../middleware/utils'),
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


exports.blogEditPost = (req, res) => {
    res.render("admin/blog_editor");
};


exports.blogNewPost = (req, res) => {
    res.render("admin/blog_editor");
};


exports.blogSubmitNewPost = (req, res) => {
    var title = utils.sanitizeQuotes(req.body.postTitle),
        body = utils.sanitizeQuotes(req.body.postBody),
        author = utils.sanitizeQuotes(req.session.username);

    body = body.replace('')
    db.addNewPostToDB(title, body, author, (err) => {
        if (err) {
            res.send('Wow, something went wrong');
            return;
        }

        res.redirect("/admin");
    });
};

exports.blogSubmitModifiedPost = (req, res) => {
    res.send(JSON.stringify(req.body.title));
};
