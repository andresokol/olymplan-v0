var express = require('express');

var configureServer = function (app) {
    app.set('port', process.env.PORT);
};

module.exports = configureServer;
