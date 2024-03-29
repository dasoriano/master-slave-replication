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
                `SELECT * FROM products WHERE id = ?`,
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

            const seller_id = parseInt(query1, 10);

            slaveInstance(
                `SELECT * FROM products WHERE seller_id = ?`,
                [seller_id],
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
            const seller_id = parseInt(query1, 10);

            slaveInstance(
                `SELECT * FROM products WHERE id = ? AND seller_id = ?`,
                [id, seller_id],
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );
        } else {
            slaveInstance(
                `SELECT * FROM products ORDER BY id LIMIT ${limit} OFFSET ${offset}`,
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );
        }
    });
}

function add(seller_id, company_name, brand_name, description, variation, price, stock) {
    return new Promise((resolve, reject) => {
        masterInstance(
            `SELECT shop_name FROM customers WHERE id = ?`,
            [seller_id],
            (error, result) => {
                if (error) {
                    reject(error);
                    resolve(result);
                } else {
                    if (result[0]['shop_name']) {
                        masterInstance(
                            `INSERT INTO products(seller_id, company_name, brand_name, description, variation, price, stock) VALUES(?, ?, ?, ?, ?, ?, ?)`,
                            [
                                seller_id,
                                company_name,
                                brand_name,
                                description,
                                variation,
                                price,
                                stock,
                            ],
                            (error, result) => {
                                if (error) reject(error);
                                resolve(result);
                            }
                        );
                    } else {
                        resolve('Undefined `shop_name`');
                    }
                }
            }
        );
    });
}

function pat(id, seller_id, company_name, brand_name, description, variation, price, stock) {
    return new Promise((resolve, reject) => {
        if (id && seller_id) {
            if (company_name) {
                masterInstance(
                    `UPDATE products SET company_name = ? WHERE id = ? AND seller_id = ?`,
                    [company_name, id, seller_id],
                    (error, result) => {
                        if (error) reject(error);
                        resolve(result);
                    }
                );
            }

            if (brand_name) {
                masterInstance(
                    `UPDATE products SET brand_name = ? WHERE id = ? AND seller_id = ?`,
                    [brand_name, id, seller_id],
                    (error, result) => {
                        if (error) reject(error);
                        resolve(result);
                    }
                );
            }

            if (description) {
                masterInstance(
                    `UPDATE products SET description = ? WHERE id = ? AND seller_id = ?`,
                    [description, id, seller_id],
                    (error, result) => {
                        if (error) reject(error);
                        resolve(result);
                    }
                );
            }

            if (variation) {
                masterInstance(
                    `UPDATE products SET variation = ? WHERE id = ? AND seller_id = ?`,
                    [variation, id, seller_id],
                    (error, result) => {
                        if (error) reject(error);
                        resolve(result);
                    }
                );
            }

            if (price) {
                masterInstance(
                    `UPDATE products SET price = ? WHERE id = ? AND seller_id = ?`,
                    [price, id, seller_id],
                    (error, result) => {
                        if (error) reject(error);
                        resolve(result);
                    }
                );
            }

            if (stock) {
                masterInstance(
                    `UPDATE products SET stock = ? WHERE id = ? AND seller_id = ?`,
                    [stock, id, seller_id],
                    (error, result) => {
                        if (error) reject(error);
                        resolve(result);
                    }
                );
            }
        }
    });
}

function del(id, seller_id) {
    return new Promise((resolve, reject) => {
        if (!id && seller_id) {
            masterInstance(
                `DELETE FROM orders WHERE product_id = (SELECT id FROM products WHERE seller_id = ?)`,
                [seller_id],
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );

            masterInstance(
                `DELETE FROM carts WHERE customer_id = ?`,
                [seller_id],
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );

            masterInstance(
                `DELETE FROM products WHERE seller_id = ?`,
                [seller_id],
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );
        } else if (id && seller_id) {
            masterInstance(
                `DELETE FROM orders WHERE product_id = (SELECT id FROM products WHERE id = ? AND seller_id = ?)`,
                [id, seller_id],
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );

            masterInstance(
                `DELETE FROM carts WHERE product_id = ? AND customer_id = ?`,
                [id, seller_id],
                (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );

            masterInstance(
                `DELETE FROM products WHERE id = ? AND seller_id = ?`,
                [id, seller_id],
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
