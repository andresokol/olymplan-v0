var main_views = require("../views/main");

module.exports = function(app) {
    app.get("*", main_views.main_page);
}
