import http from 'http';
import './database.js';
import router from './router.js';

const port = 3000;
const server = http.createServer(router);

server.listen(port, () => console.log('[SERVER] Server is online...'));
