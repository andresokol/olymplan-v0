var express = require('express'),
    app = express(),
    config = require('./middleware')(app),
    http = require('http').Server(app);

http.listen(app.get('port'), function () {
    console.log('Server is up. Port: ' + app.get('port'));
});
