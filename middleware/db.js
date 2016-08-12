var pg = require('pg'),
    db_url = process.env.DB_URL;

var run_request = function(qstring, callback) {
    pg.connect(db_url, function (err, client, done) {
        // handling error
        if (err) {
            console.log(err);
            callback(undefined);
            return 0;
        }

        // running request
        client.query(qstring);
        query.on('row', function(row, result) {
            result.addRow(row);
        });
        query.on('end', function (result) {
            callback(result.rows);
        });

        done();
    });
};

exports.get_by_id = function(table, id, callback) {
    if(id === NaN) {
        callback(undefined);
        console.log('(db.js:29) id is not a number');
    }
    else {
        var qstring = "SELECT * FROM " + table + " WHERE id = '" + id + "';";
        run_request(qstring, callback);
    }
};
