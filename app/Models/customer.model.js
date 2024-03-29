import { masterInstance, slaveInstance } from '../database.js';

function get(params, offset = 0, limit = 50) {
    return new Promise((resolve, reject) => {
        if (params) {
            if (/\D+/g.test(params)) {
                console.log('[QUERY] Invalid Query:', params);
                resolve([]);
            }

            const id = parseInt(params, 10);
            resolve(slaveInstance(
                `SELECT * FROM customers WHERE id = ${id}`
            ));
        } else {
            resolve(slaveInstance(
                `SELECT * FROM customers ORDER BY id LIMIT ${limit} OFFSET ${offset}`,
            ));
        }
    });
}

function add(
    username, 
    password, 
    surname, 
    first_name, 
    email
) {
    return new Promise((resolve, reject) => {
        resolve(masterInstance(
            `INSERT INTO customers(username, password, surname, first_name, email) VALUES(?, ?, ?, ?, ?)`,
            [username, password, surname, first_name, email]
        ));
    });
}

function pat(
    id, 
    username, 
    password, 
    surname, 
    first_name, 
    email, 
    residence, 
    baranggay_id, 
    municipality_id, 
    province_id, 
    shop_name
) {
    return new Promise((resolve, reject) => {
        if (id) {
            if (username) {
                resolve(masterInstance(
                    `UPDATE customers SET username = ? WHERE id = ?`,
                    [username, id]
                ));
            }

            if (password) {
                resolve(masterInstance(
                    `UPDATE customers SET password = ? WHERE id = ?`,
                    [password, id]
                ));
            }

            if (surname) {
                resolve(masterInstance(
                    `UPDATE customers SET surname = ? WHERE id = ?`,
                    [surname, id]
                ));
            }

            if (first_name) {
                resolve(masterInstance(
                    `UPDATE customers SET first_name = ? WHERE id = ?`,
                    [first_name, id],
                ));
            }

            if (email) {
                resolve(masterInstance(
                    `UPDATE customers SET email = ? WHERE id = ?`,
                    [email, id]
                ));
            }

            if (residence) {
                resolve(masterInstance(
                    `UPDATE customers SET residence = ? WHERE id = ?`,
                    [residence, id]
                ));
            }

            if (baranggay_id) {
                resolve(masterInstance(
                    `UPDATE customers SET baranggay_id = ? WHERE id = ?`,
                    [baranggay_id, id]
                ));
            }

            if (municipality_id) {
                resolve(masterInstance(
                    `UPDATE customers SET municipality_id = ? WHERE id = ?`,
                    [municipality_id, id]
                ));
            }

            if (province_id) {
                resolve(masterInstance(
                    `UPDATE customers SET province_id = ? WHERE id = ?`,
                    [province_id, id]
                ));
            }

            if (shop_name) {
                resolve(masterInstance(
                    `UPDATE customers SET shop_name = ? WHERE id = ?`,
                    [shop_name, id]
                ));
            }
        }
    });
}

function del(id) {
    return new Promise((resolve, reject) => {
        resolve(masterInstance(
            `DELETE FROM transactions WHERE customer_id = ?`,
            [id]
        ));

        resolve(masterInstance(
            `DELETE FROM orders WHERE buyer_id = ?`,
            [id]
        ));

        resolve(masterInstance(
            `DELETE FROM batches WHERE cart_id = (SELECT id FROM carts WHERE customer_id = ?)`,
            [id]
        ));

        resolve(masterInstance(
            `DELETE FROM carts WHERE customer_id = ?`,
            [id]
        ));

        resolve(masterInstance(
            `DELETE FROM products WHERE seller_id = ?`,
            [id]
        ));

        resolve(masterInstance(
            `DELETE FROM customers WHERE id = ?`,
            [id]
        ));
    });
}

export default {
    get,
    add,
    pat,
    del,
};
