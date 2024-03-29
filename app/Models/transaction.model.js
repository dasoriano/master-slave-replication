import { masterInstance, slaveInstance } from '../database.js';

function get(query0, query1, offset = 0, limit = 50) {
    return new Promise((resolve, reject) => {
        if (query0 && !query1) {
            if (/\D+/g.test(query0)) {
                console.log('[QUERY] Invalid Query.', query0);
                resolve([]);
            }

            const id = parseInt(query0, 10);

            slaveInstance(
                `SELECT * FROM transactions WHERE id = ?`,
                [id],
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );
        } else if (!query0 && query1) {
            if (/\D+/g.test(query1)) {
                console.log('[QUERY] Invalid Query.', query1);
                resolve([]);
            }

            const customer_id = parseInt(query1, 10);

            slaveInstance(
                `SELECT * FROM transactions WHERE customer_id = ?`,
                [customer_id],
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );
        } else if (query0 && query1) {
            if (/\D+/g.test(query0) && /\D+/g.test(query1)) {
                console.log('[QUERY] Invalid Query.', query0, query1);
                resolve([]);
            }

            const id = parseInt(query0, 10);
            const customer_id = parseInt(query1, 10);

            slaveInstance(
                `SELECT * FROM transactions WHERE id= ? AND customer_id = ?`,
                [id, customer_id],
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );
        } else {
            slaveInstance(
                `SELECT * FROM transactions ORDER BY id LIMIT ${limit} OFFSET ${offset}`,
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );
        }
    });
}

export default {
    get,
};
