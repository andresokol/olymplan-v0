var utils = require('../middleware/utils'),
    tables = require("../db_tables_config.json"),
    db = require('../middleware/db'),
    mailer = require('../middleware/mailer');

exports.check_auth = (req, res, next) => {
    if (!req.session.username)
        res.redirect('/user/login?r=' + req.originalUrl);
    else
        next();
};

exports.user_info = (req, res) => {
    db.getUserData(req.session.username).then((result) => {
        res.send(JSON.stringify(result[0]));
    }).catch((e) => {
        res.send(e);
    });
};

exports.login = (req, res) => {
    if (req.session.username === undefined) {
        res.render('user/login_page');
    } else {
        res.redirect("/user/");
    }
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
    values['verified'] = false;

    var verification_code = utils.getHash(username);
    console.log(values);
    console.log(verification_code);
    db.addNewUser(values, verification_code).then(() => {
        req.session.username = username;
        res.redirect("/user");
        mailer.sendVerificationLetter(username, email, verification_code);
    }, (e) => {
        console.log("[views/api.js:51] OOOPS " + typeof(e));
        res.send("Something went wrong" + JSON.stringify(e));
    });
};


exports.verifyNewUser = (req, res) => {
    var vercode = req.params.vercode,
        username = req.params.username;

    if (isNaN(parseInt(vercode, 16)) ||
            vercode.match(/[^0-9a-f]/i) !== null) {
        res.send('Sorry, seems smth gone wrong. Try to check your link.');
        return;
    }

    db.verifyUser(username, vercode, () => {
        res.redirect("/user/");
    }, () => {
        res.send('Sorry, seems smth gone wrong. Try to check your link.');
    });
};
