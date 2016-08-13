var express = require('express'),
    router = require('../route'),
    ejs = require('ejs-mate'),
    session = require('express-session'),
    body_parser = require('body-parser');


var configureServer = function (app) {
    app.set('port', process.env.PORT);
    app.set('env', process.env.NODE_ENV);

    // Setting default engine for response rendering
    app.set('view engine', 'ejs');
    // 'views' is not views folder but templates, so fuck my life
    app.set('views', './templates/'); // so root folder for templates is set here

    // setting up cookies
    app.use(session({
        secret: 'picture yourself on a boat on a river',
        resave: false,
        saveUninitialized: true
    }));

    // setting up 'post'-method
    app.use(body_parser.urlencoded({ extended: false }));

    // setting up static files
    app.use('/st', express.static(process.env.STATIC_DIR));

    router(app);
};

module.exports = configureServer;
