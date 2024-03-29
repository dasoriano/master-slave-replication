import { masterInstance, slaveInstance } from '../database.js';

function _sanitize(text) {
    return text.replace(/([^a-z-A-Z. '])+/g, '');
}

function get(query, offset = 0, limit = 50) {
    return new Promise((resolve, reject) => {
        if (query) {
            if (/\D+/g.test(query)) {
                console.log('[QUERY] Invalid Query.', query);
                resolve([]);
            }

            const id = parseInt(query, 10);

            slaveInstance(
                `SELECT * FROM batches WHERE id = ?`,
                [id],
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );
        } else {
            slaveInstance(
                `SELECT * FROM batches ORDER BY id LIMIT ${limit} OFFSET ${offset}`,
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );
        }
    });
}

function add(batch_order, cart_arrayId) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < cart_arrayId.length; i++) {
            masterInstance(
                `SELECT stock FROM products WHERE id = (SELECT product_id FROM carts WHERE id = ?)`,
                [cart_arrayId[i]],
                (error, result) => {
                    if (error) {
                        reject(error);
                        resolve(result);
                    } else {
                        const stock = result[0]['stock'];

                        masterInstance(
                            `SELECT quantity FROM carts WHERE id = ?`,
                            [cart_arrayId[i]],
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                    resolve(result);
                                } else {
                                    if (0 <= stock - result[0]['quantity']) {
                                        masterInstance(
                                            `INSERT INTO batches (batch_order, cart_id) VALUES (?, ?)`,
                                            [batch_order, cart_arrayId[i]],
                                            (error, result) => {
                                                if (error) reject(error);
                                                resolve(result);
                                            }
                                        );

                                        masterInstance(
                                            `INSERT INTO orders (buyer_id, product_id, price, quantity, time, date) 
                                            VALUES (
                                                (SELECT customer_id FROM carts WHERE id = ?), 
                                                (SELECT product_id FROM carts WHERE id = ?), 
                                                ((SELECT quantity FROM carts WHERE id = ?) * (SELECT price FROM products WHERE id = (SELECT product_id FROM carts WHERE id = ?))),
                                                (SELECT quantity FROM carts WHERE id = ?),
                                                ?,
                                                ?
                                            )`,
                                            [
                                                cart_arrayId[i],
                                                cart_arrayId[i],
                                                cart_arrayId[i],
                                                cart_arrayId[i],
                                                cart_arrayId[i],
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
                                                        `INSERT INTO transactions (customer_id, order_id, instance) VALUES ((SELECT customer_id FROM carts WHERE id = ?), ?, ?)`,
                                                        [
                                                            cart_arrayId[i],
                                                            result['insertId'],
                                                            'bought',
                                                        ],
                                                        (error, result) => {
                                                            if (error) reject(error);
                                                            resolve(result);
                                                        }
                                                    );

                                                    masterInstance(
                                                        `INSERT INTO transactions (customer_id, order_id, instance) VALUES ((SELECT seller_id FROM products WHERE id = (SELECT product_id FROM carts WHERE id = ?)), ?, ?)`,
                                                        [
                                                            cart_arrayId[i],
                                                            result['insertId'],
                                                            'sold',
                                                        ],
                                                        (error, result) => {
                                                            if (error) reject(error);
                                                            resolve(result);
                                                        }
                                                    );
                                                }
                                            }
                                        );

                                        masterInstance(
                                            `UPDATE products SET stock = ((SELECT stock FROM products WHERE id = (SELECT product_id FROM carts WHERE id = ?)) - (SELECT quantity FROM carts WHERE id = ?)) WHERE id = (SELECT product_id FROM carts WHERE id = ?)`,
                                            [cart_arrayId[i], cart_arrayId[i], cart_arrayId[i]],
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
            );
        }
    });
}

export default {
    get,
    add,
};
