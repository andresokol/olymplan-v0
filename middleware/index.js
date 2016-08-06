var express = require('express'),
    router = require('../route'),
    ejs = require('ejs-locals');

var configureServer = function (app) {
    app.set('port', process.env.PORT);

    // Setting default engine for response rendering
    app.set('view engine', 'ejs');
    // 'views' is not views folder but templates, fuck my life
    app.set('views', './templates/'); // so root folder for templates is set here

    router(app);
};

module.exports = configureServer;
