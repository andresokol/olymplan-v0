module.exports = (start_server) => {
    var errors = [];
    if (process.env.DB_HOST === undefined) errors.push('DB_HOST not specified in .env file');
    if (process.env.DB_NAME === undefined) errors.push('DB_NAME not specified in .env file');
    if (process.env.DB_PASSWORD === undefined) errors.push('DB_PASSWORD not specified in .env file');
    if (process.env.DB_PORT === undefined) errors.push('DB_PORT not specified in .env file');
    if (process.env.DB_USER === undefined) errors.push('DB_USER not specified in .env file');
    if (process.env.DB_USE_SSL === undefined) errors.push('DB_USE_SSL not specified in .env file');
    if (process.env.EMAIL_PROVIDER === undefined) errors.push('EMAIL_PROVIDER not specified in .env file');
    if (process.env.EMAIL_LOGIN === undefined) errors.push('EMAIL_LOGIN not specified in .env file');
    if (process.env.EMAIL_PASSWORD === undefined) errors.push('EMAIL_PASSWORD not specified in .env file');
    if (process.env.EMAIL_FULL_ADDRESS === undefined) errors.push('EMAIL_FULL_pushRESS not specified in .env file');
    if (process.env.NODE_ENV === undefined) errors.push('NODE_ENV not specified in .env file');
    if (process.env.STATIC_DIR === undefined) errors.push('STATIC_DIR not specified in .env file');


    var db_config = undefined;
    try {
        db_config = require('../db_tables_config.json');
        if (db_config.user_list === undefined) errors.push('Table for users did not specified in db_tables_config.json');
        if (db_config.verification_codes === undefined) errors.push('Table for verification codes did not specified in db_tables_config.json');
        if (db_config.event_list === undefined) errors.push('Table for events did not specified in db_tables_config.json');
    } catch (err) {
        errors.push('File db_tables_config.json do not exist');
    }

    if (errors.length !== 0) {
        console.log("Detected " + errors.length + " errors in configs:");
        for(let i = 0; i < errors.length; i += 1) {
            console.log((i+1) + ": " + errors[i]);
        }

        console.log("Stopping server...");
        process.exit(1);
    }

    console.log('Configs are OK');
    start_server();
    require("./mailer").checkConnection( () => {} );
};
