var Pool = require('pg').Pool,
    pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: process.env.DB_USE_SSL,
        idleTimeoutMillis: 1000 //close idle clients after 1 second
    });
    tables = require("../db_tables_config.json");

var run_request = function(qstring) {
    return new Promise((resolve, reject) => {
        pool.query(qstring, function (err, result) {
            if(err) {
                console.log(err);
                reject(err);
            }

            resolve(result.rows);
        });
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

exports.validate_login = function(username, password, callback) {
    var qstring = "SELECT password FROM " + tables.user_list + " WHERE username = '" + username + "';";

    run_request(qstring)
            .then((result) => {
                if (result[0].password == password) callback({'connected': true, 'auth_success': true});
                else                                callback({'connected': true, 'auth_success': false});
            })
            .catch((err) => {
                callback({'connected': false});
            });
};

exports.validate_admin_rights = (username) => {
    return new Promise((resolve, reject) => {
        var qstring = "SELECT * FROM " + tables.admin_list + " WHERE username = '" + username + "'";

        run_request(qstring)
            .then((result) => {
                if (result[0] == undefined) reject();
                else                        resolve();
            }).catch((e) => {console.log(e);});

    });
}

exports.get_table = (table, container_for_result = []) => {
    return new Promise((resolve, reject) => {
        var qstring = "SELECT * FROM " + table + ";";
        run_request(qstring).then((result) => {
            resolve(container_for_result.concat([result]));
        }).catch((e) => {reject(e)});
    });
}

/*
// FIXME: copy-paste detected
exports.get_universities_as_table = () => {
    return new Promise((resolve, reject) => {
        get_table(tables.university_list).then(resolve).catch(reject);
    });
}

exports.get_faculties_as_table = () => {
    return new Promise((resolve, reject) => {
        get_table(tables.faculties_list).then(resolve).catch(reject);
    });
}

exports.get_specialties_as_table = () => {
    return new Promise((resolve, reject) => {
        get_table(tables.specialities_list).then(resolve).catch(reject);
    });
}

exports.get_olympiads_as_table = () => {
    return new Promise((resolve, reject) => {
        get_table(tables.olympiad_list).then(resolve).catch(reject);
    });
}

exports.get_olympiad_tours_as_table = () => {
    return new Promise((resolve, reject) => {
        get_table(tables.tours_list).then(resolve).catch(reject);
    });
}
*/
