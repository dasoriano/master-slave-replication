import {
    homepageRoute,
    customerRoute,
    productRoute,
    cartRoute,
    batchRoute,
    orderRoute,
    transactionRoute,
} from './routes.js';

export function logger(request) {
    console.log(`${new Date().toLocaleString()} ${request.method} ${request.url}`);
}

export async function payloadParser(request) {
    return new Promise((resolve, reject) => {
        let chunk = '';
        request.on('data', (data) => (chunk += data));
        request.on('end', () => {
            try {
                resolve(JSON.parse(chunk));
            } catch {
                resolve({});
            }
        });
    });
}

export default async function router(request, response) {
    logger(request);

    const requestUrl = new URL(`http://${request.headers.host}${request.url}`);
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500');

    const formData = await payloadParser(request);
    request.data = formData;
    request.requestUrl = requestUrl;

    if (requestUrl.pathname === '/') {
        return homepageRoute(request, response);
    }

    if (requestUrl.pathname === '/api/v1/customer') {
        return customerRoute(request, response);
    }

    if (requestUrl.pathname === '/api/v1/product') {
        return productRoute(request, response);
    }

    if (requestUrl.pathname === '/api/v1/cart') {
        return cartRoute(request, response);
    }

    if (requestUrl.pathname === '/api/v1/batch') {
        return batchRoute(request, response);
    }

    if (requestUrl.pathname === '/api/v1/order') {
        return orderRoute(request, response);
    }

    if (requestUrl.pathname === '/api/v1/transaction') {
        return transactionRoute(request, response);
    }

    response.statusCode = 404;
    response.setHeader('content-type', 'application/json');
    response.write(
        JSON.stringify({
            status: 404,
            message: 'Endpoint not found.',
        })
    );
    return response.end();
}
