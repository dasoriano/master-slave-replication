import mysql from 'mysql';
import util from 'util';

const masterConnection = mysql.createConnection({
    host: "rest_api",
    user: "mydb_user",
    password: "mydb_pwd",
    port: 3000,
    database: "mydb",
});

const slaveConnection1 = mysql.createConnection({
    host: "rest_api",
    user: "mydb_slave1_user",
    password: "mydb_slave1_pwd",
    port: 3000,
    database: "mydb",
});

const slaveConnection2 = mysql.createConnection({
    host: "rest_api",
    user: "mydb_slave2_user",
    password: "mydb_slave2_pwd",
    port: 3000,
    database: "mydb",
});

const slaveConnection3 = mysql.createConnection({
    host: "rest_api",
    user: "mydb_slave3_user",
    password: "mydb_slave3_pwd",
    port: 3000,
    database: "mydb",
});

export async function masterInstance(...args) {
    try {
        const masterQuery = util.promisify(masterConnection.query).bind(masterConnection);
        const masterResults = await masterQuery(...args);
        const masterCommit = util.promisify(masterConnection.commit).bind(masterConnection);
        await masterCommit();
        // masterConnection.end();
        
        console.log(...args);
        console.log(masterResults);
    } catch (error) {
        console.log(error);
    }
};

let slaveId = 0;
export async function slaveInstance(...args) {
    try {
        const slaveConnections = [
            slaveConnection1,
            slaveConnection2,
            slaveConnection3,
        ];
        
        const slaveQuery = util.promisify(slaveConnections[slaveId].query).bind(slaveConnections[slaveId]);
        const slaveResults = await slaveQuery(...args);
        // slaveConnections[slaveId].end();
        
        console.log('[PORT] Slave Connection:', slaveConnections[slaveId].config.port);
        console.log(slaveResults);
        
        if (slaveId == 2) slaveId = 0;
        else slaveId++;

    } catch (error) {
        console.log(error);
    };
};