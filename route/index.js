var main_views = require("../views/main"),
    admin_views = require("../views/admin"),
    api_views = require("../views/api.js");

module.exports = function(app) {
    app.get('/university/:id', main_views.university);
    app.get("/", main_views.main_page);

    app.get("/admin/*", admin_views.validate_admin_rights);
    app.get("/admin/", admin_views.main);

    app.post("/api/login", api_views.validate_login);
}
