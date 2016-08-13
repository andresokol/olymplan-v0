var db = require('../middleware/db'),
    utils = require('../middleware/utils');

exports.validate_login = function (req, res) {
    var login = utils.sanitizeQuotes(req.body.login),
        pass  = req.body.password;

    if (login == undefined || login == "" ||
        pass == undefined || pass == "") {
        res.send('false');
        return;
    }

    console.log(login, pass);

    db.validate_login(login, pass, function(auth_result) {
        console.log(login, pass, auth_result);

        if (auth_result.auth_success) req.session.username = login;

        res.send(auth_result);
    });
}
