import app from '../app';
import connection from '../database/connection';
import debugLib from 'debug';
import seedUser from '../database/seeedUser';


const debug = debugLib('compareContentAPI');
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);
/**
 * Create HTTP server.
 */

const server = require('http').createServer(app);


connection()
    .then((res) => {
        console.log('Database Connection Establish!.');
        seedUser()
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
    })
    .catch(err => console.log('Error establishing DB connection', err));

function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            /* eslint-disable no-console */
            console.error(bind + ' requires elevated privileges');
            process.exit(1);

            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log(`Server Listening on Port ${bind}`);
    debug('Listening on ' + bind);
}