var main_views = require("../views/main"),
    admin_views = require("../views/admin"),
    user_views = require("../views/user"),
    api_views = require("../views/api"),
    about_views = require("../views/about"),
    utils = require('../middleware/utils');

module.exports = function(app) {
    app.get("/", main_views.landing_page);
    //app.get('/university/:id', main_views.university);

    app.get('/events/', main_views.get_event_list);
    app.get('/events/:id', main_views.get_event);

    // User pages
    app.get('/user/', user_views.check_auth, user_views.user_info);
    app.get('/user/login', user_views.login);
    app.get('/user/register', user_views.showRegisterPage);
    app.post('/user/register', user_views.registerNewUser);
    app.get('/user/verify/:vercode/:username', user_views.verifyNewUser);

    // API + AJAX
    app.post("/api/login", api_views.validate_login);
    app.get("/api/check_username/:username", api_views.check_username_availability);

    // Administer pages
    app.get("/admin*", admin_views.validate_admin_rights);
    app.get("/admin/", admin_views.main);

    // Debug features
    //app.get('/test', mail_views.show_message_input);
    //app.post('/test', mail_views.send_message);

    app.get('/test/api', (req, res) => {
        res.send('{"Math": ["Math1", "Math2"], "PE": ["PE1", "PE2"]}');
    });

    app.get('/test/hash/:str_to_hash', (req, res) => {
        var hash = utils.getHash(req.params.str_to_hash);
        console.log('eee');
        res.send("eee");
    });

    app.get("*", (req, res) => {
        res.send(404, "404, ouch!");
    });
}
