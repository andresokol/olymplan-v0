var main_views = require("../views/main"),
    admin_views = require("../views/admin"),
    api_views = require("../views/api.js");

module.exports = function(app) {
    app.get("/", main_views.main_page);
    app.get('/university/:id', main_views.university);

    app.get('/events/', main_views.get_event_list);
    app.get('/events/:id', main_views.get_event);

    // API + AJAX
    app.post("/api/login", api_views.validate_login);

    // Administer pages
    app.get("/admin*", admin_views.validate_admin_rights);
    app.get("/admin/", admin_views.main);

    // debug features
    app.get('/test', (req, res) => {
        res.render('test.ejs');
    });

    app.get('/test/api', (req, res) => {
        res.send('{"Math": ["Math1", "Math2"], "PE": ["PE1", "PE2"]}');
    });

    app.get("*", (req, res) => {
        res.send("404, ouch!");
    });
}
