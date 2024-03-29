import carts from '../Models/cart.model.js';

export async function getCart(request, response) {
    response.setHeader('content-type', 'application/json');

    try {
        const data = await carts.get(
            request.requestUrl.searchParams.get('id'),
            request.requestUrl.searchParams.get('customer-id')
        );

        response.write(
            JSON.stringify({
                success: true,
                data: data,
            })
        );
    } catch (error) {
        response.write(
            JSON.stringify({
                success: false,
                message: error.message,
            })
        );
    }
    return response.end();
}

export async function addCart(request, response) {
    response.setHeader('content-type', 'application/json');

    try {
        const { customer_id, product_id, quantity } = request.data || {};

        if (!customer_id || !product_id || !quantity) {
            response.write(
                JSON.stringify({
                    success: false,
                    message:
                        'Invalid data. Expecting `customer_id`, `product_id`, and `quantity`.',
                })
            );
            return response.end();
        }

        const data = await carts.add(customer_id, product_id, quantity);

        response.write(
            JSON.stringify({
                success: true,
                data: data,
            })
        );
    } catch (error) {
        response.write(
            JSON.stringify({
                success: false,
                message: error.message,
            })
        );
    }
    return response.end();
}

export async function patCart(request, response) {
    response.setHeader('content-type', 'application/json');

    try {
        const { id, customer_id, quantity } = request.data || {};

        const data = await carts.pat(id, customer_id, quantity);

        response.write(
            JSON.stringify({
                success: true,
                data: data,
            })
        );
    } catch (error) {
        response.write(
            JSON.stringify({
                success: false,
                message: error.message,
            })
        );
    }
    return response.end();
}

export async function delCart(request, response) {
    response.setHeader('content-type', 'application/json');

    try {
        const { id, customer_id } = request.data || {};

        const data = await carts.del(id, customer_id);

        response.write(
            JSON.stringify({
                success: true,
                data: data,
            })
        );
    } catch (error) {
        response.write(
            JSON.stringify({
                success: false,
                message: error.message,
            })
        );
    }
    return response.end();
}
