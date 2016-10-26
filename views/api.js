const salt = process.env.HASH_SALT,
    db = require('../middleware/db'),
    utils = require('../middleware/utils'),
    crypto = require('crypto');

exports.validate_login = function (req, res) {
    var login = utils.sanitizeQuotes(req.body.login),
        pass  = req.body.password;

    if (login == undefined || login == "" ||
        pass == undefined || pass == "") {
        res.send('false');
        return;
    }

    const hashed_pass = crypto.createHmac('sha256', salt)
                   .update(pass)
                   .digest('hex');
    console.log(login, hashed_pass);

    db.validate_login(login, hashed_pass, function(auth_result) {
        console.log(login, hashed_pass, auth_result);

        if (auth_result.auth_success) req.session.username = login;

        res.send(auth_result);
    });
};

exports.check_username_availability = (req, res) => {
    var username = utils.sanitizeQuotes(req.params.username);
    db.check_username_existence(username).then(() => {
        res.send(false);
    }, () => {
        res.send(true);
    });
}
