import { masterInstance, slaveInstance } from '../database.js';

function _sanitize(text) {
    return text.replace(/([^a-z-A-Z. '])+/g, '');
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
                `SELECT * FROM orders WHERE id = ?`,
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

            const buyer_id = parseInt(query1, 10);

            slaveInstance(
                `SELECT * FROM orders WHERE buyer_id = ?`,
                [buyer_id],
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
            const buyer_id = parseInt(query1, 10);

            slaveInstance(
                `SELECT * FROM orders WHERE id= ? AND buyer_id = ?`,
                [id, buyer_id],
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );
        } else {
            slaveInstance(
                `SELECT * FROM orders ORDER BY id LIMIT ${limit} OFFSET ${offset}`,
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );
        }
    });
}

function add(buyer_id, product_id, quantity) {
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
                            `INSERT INTO orders (buyer_id, product_id, price, quantity, time, date) VALUES (?, ?, (? * (SELECT price FROM products WHERE id = ?)), ?, ?, ?)`,
                            [
                                buyer_id,
                                product_id,
                                quantity,
                                product_id,
                                quantity,
                                `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
                                `${new Date().getFullYear()}/${
                                    new Date().getMonth() + 1
                                }/${new Date().getDate()}`,
                            ],
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                    resolve(result);
                                } else {
                                    masterInstance(
                                        `INSERT INTO transactions (customer_id, order_id, instance) VALUES (?, ?, ?)`,
                                        [buyer_id, result['insertId'], 'bought'],
                                        (error, result) => {
                                            if (error) reject(error);
                                            resolve(result);
                                        }
                                    );

                                    masterInstance(
                                        `INSERT INTO transactions (customer_id, order_id, instance) VALUES ((SELECT seller_id FROM products WHERE id = ?), ?, ?)`,
                                        [product_id, result['insertId'], 'sold'],
                                        (error, result) => {
                                            if (error) reject(error);
                                            resolve(result);
                                        }
                                    );
                                }
                            }
                        );

                        masterInstance(
                            `UPDATE products SET stock = ((SELECT stock FROM products WHERE id = ?) - ?) WHERE id = ?`,
                            [product_id, quantity, product_id],
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

export default {
    get,
    add,
};
