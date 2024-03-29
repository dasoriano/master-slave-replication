import { masterInstance, slaveInstance } from '../database.js';

function _sanitize(text) {
    return text.replace(/([^a-z-A-Z-0-9. '])+/g, '');
}

function get(query0, query1, offset = 0, limit = 50) {
    return new Promise((resolve, reject) => {
        if (query0 && !query1) {
            if (/\D+/g.test(query0)) {
                console.log('[QUERY] Invalid Query.', query0);
                resolve([]);
            }

            const id = parseInt(query0, 10);

            slaveInstance(
                `SELECT * FROM carts WHERE id = ?`,
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
                `SELECT * FROM carts WHERE customer_id = ?`,
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
                `SELECT * FROM carts WHERE id= ? AND customer_id = ?`,
                [id, customer_id],
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );
        } else {
            slaveInstance(
                `SELECT * FROM carts ORDER BY id LIMIT ${limit} OFFSET ${offset}`,
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );
        }
    });
}

function add(customer_id, product_id, quantity) {
    return new Promise((resolve, reject) => {
        masterInstance(
            `SELECT stock FROM products WHERE id = ?`,
            [product_id],
            (error, result) => {
                if (error) {
                    reject(error);
                    resolve(result);
                } else {
                    if (0 <= result[0]['stock'] - quantity) {
                        masterInstance(
                            `INSERT INTO carts(customer_id, product_id, price, quantity) VALUES(?, ?, (? * (SELECT price FROM products WHERE id = ?)), ?)`,
                            [customer_id, product_id, quantity, product_id, quantity],
                            (error, result) => {
                                if (error) reject(error);
                                resolve(result);
                            }
                        );
                    } else {
                        resolve('Not enough stock.');
                    }
                }
            }
        );
    });
}

function pat(id, customer_id, quantity) {
    return new Promise((resolve, reject) => {
        if (id && customer_id) {
            if (quantity) {
                masterInstance(
                    `SELECT stock FROM products WHERE id = (SELECT product_id FROM carts WHERE id = ?)`,
                    [id],
                    (error, result) => {
                        if (error) {
                            reject(error);
                            resolve(result);
                        } else {
                            if (0 <= result[0]['stock'] - quantity) {
                                masterInstance(
                                    `UPDATE carts SET price = (? * (SELECT price FROM products WHERE id = (SELECT product_id FROM carts WHERE id = ?))), quantity = ? WHERE id = ?`,
                                    [quantity, id, quantity, id],
                                    (error, result) => {
                                        if (error) reject(error);
                                        resolve(result);
                                    }
                                );
                            } else {
                                resolve('Not enough stock.');
                            }
                        }
                    }
                );
            }
        }
    });
}

function del(id, customer_id) {
    return new Promise((resolve, reject) => {
        if (!id && customer_id) {
            masterInstance(
                `DELETE FROM batches WHERE cart_id = (SELECT id FROM carts WHERE customer_id = ?)`,
                [customer_id],
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );

            masterInstance(
                `DELETE FROM carts WHERE customer_id = ?`,
                [customer_id],
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );
        } else if (id && customer_id) {
            masterInstance(
                `DELETE FROM batches WHERE cart_id = (SELECT id FROM carts WHERE id = ? AND customer_id = ?)`,
                [id, customer_id],
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );

            masterInstance(
                `DELETE FROM carts WHERE id = ? AND customer_id = ?`,
                [id, customer_id],
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
    add,
    pat,
    del,
};
