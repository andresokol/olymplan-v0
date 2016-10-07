var utils = require('../middleware/utils');
    tables = require("../db_tables_config.json"),
    db = require('../middleware/db'),
    email = require('../middleware/email');

exports.check_auth = (req, res, next) => {
    if (!req.session.username)
        res.redirect('/user/login?r=' + req.originalUrl);
    else
        next();
};

exports.user_info = (req, res) => {
    res.send(req.session.username);
};

exports.login = (req, res) => {
    res.render('user/login_page');
};

exports.showRegisterPage = (req, res) => {
    res.render('user/register_page');
};

exports.registerNewUser = (req, res) => {
    var username = req.body.username,
        password = req.body.password,
        email = req.body.email;

    if(username === undefined || password === undefined || email === undefined)
    {
        console.log('[views/user.js:31]', username, password, email);
        res.send('Something went wrong :o' + JSON.stringify(req.body));
        return;
    }

    if(!utils.checkForbiddenSymbols(username) ||
       !utils.checkForbiddenSymbols(password) ||
       !utils.checkIfEmailValid(email))
    {
        res.send('Something went wrong :o');
        return;
    }

    var values = {};
    values['username'] = username;
    values['password'] = password;
    values['email'] = utils.sanitizeQuotes(email);

    db.addRowToTable(tables.user_list, values).then(() => {
        console.log("[views/api.js:51] New user - " + username);
        req.session.username = username;
        email.test();
        res.redirect("/user");
        email.sendVerificationLetter(username, email);
    });/*.catch((e) => {
        console.log("[views/api.js:51] OOOPS " + typeof(e));
        res.send("Something went wrong" + JSON.stringify(e));
    });*/
};
