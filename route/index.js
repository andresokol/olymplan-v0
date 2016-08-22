var main_views = require("../views/main"),
    admin_views = require("../views/admin"),
    api_views = require("../views/api.js");

module.exports = function(app) {
    app.get("/", main_views.main_page);
    app.get('/university/:id', main_views.university);

    // API + AJAX
    app.post("/api/login", api_views.validate_login);

    // Administer pages
    app.get("/admin*", admin_views.validate_admin_rights);
    app.get("/admin/", admin_views.main);

    // debug features
    app.get('/test/login', (req, res) => {
        res.render('test.ejs');
    });
}
