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

exports.register_user = (req, res) => {
    res.render('user/register_page');
}
