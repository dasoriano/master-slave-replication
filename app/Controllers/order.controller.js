import orders from '../Models/order.model.js';

export async function getOrder(request, response) {
    response.setHeader('content-type', 'application/json');

    try {
        const data = await orders.get(
            request.requestUrl.searchParams.get('id'),
            request.requestUrl.searchParams.get('buyer-id')
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

export async function addOrder(request, response) {
    response.setHeader('content-type', 'application/json');

    try {
        const { buyer_id, product_id, quantity } = request.data || {};

        if (!buyer_id || !product_id || !quantity) {
            response.write(
                JSON.stringify({
                    success: false,
                    message: 'Invalid data. Expecting `buyer_id`, `product_id`, and `quantity`.',
                })
            );
            return response.end();
        }

        const data = await orders.add(buyer_id, product_id, quantity);

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
