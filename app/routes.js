import {
    addCustomer,
    getCustomer,
    patCustomer,
    delCustomer,
} from './Controllers/customer.controller.js';

import {
    addProduct,
    getProduct,
    patProduct,
    delProduct,
} from './Controllers/product.controller.js';

import { addCart, getCart, patCart, delCart } from './Controllers/cart.controller.js';

import { addBatch, getBatch } from './Controllers/batch.controller.js';

import { addOrder, getOrder } from './Controllers/order.controller.js';

import { getTransaction } from './Controllers/transaction.controller.js';

export function homepageRoute(request, response) {
    response.setHeader('content-type', 'application/json');
    response.write(
        JSON.stringify({
            message: 'Simple CRUD API Application',
        })
    );
    return response.end();
}

export function customerRoute(request, response) {
    if (request.method === 'GET') {
        return getCustomer(request, response);
    } else if (request.method === 'POST') {
        return addCustomer(request, response);
    } else if (request.method === 'PATCH') {
        return patCustomer(request, response);
    } else if (request.method === 'DELETE') {
        return delCustomer(request, response);
    }
    return response.end();
}

export function productRoute(request, response) {
    if (request.method === 'GET') {
        return getProduct(request, response);
    } else if (request.method === 'POST') {
        return addProduct(request, response);
    } else if (request.method === 'PATCH') {
        return patProduct(request, response);
    } else if (request.method === 'DELETE') {
        return delProduct(request, response);
    }
    return response.end();
}

export function cartRoute(request, response) {
    if (request.method === 'GET') {
        return getCart(request, response);
    } else if (request.method === 'POST') {
        return addCart(request, response);
    } else if (request.method === 'PATCH') {
        return patCart(request, response);
    } else if (request.method === 'DELETE') {
        return delCart(request, response);
    }
    return response.end();
}

export function batchRoute(request, response) {
    if (request.method === 'GET') {
        return getBatch(request, response);
    } else if (request.method === 'POST') {
        return addBatch(request, response);
    }
    return response.end();
}

export function orderRoute(request, response) {
    if (request.method === 'GET') {
        return getOrder(request, response);
    } else if (request.method === 'POST') {
        return addOrder(request, response);
    }
    return response.end();
}

export function transactionRoute(request, response) {
    if (request.method === 'GET') {
        return getTransaction(request, response);
    }
    return response.end();
}
