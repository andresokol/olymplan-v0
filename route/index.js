var main_views = require("../views/main");

module.exports = function(app) {
    app.get('/university/:id', main_views.university);
    app.get("*", main_views.main_page);
}
