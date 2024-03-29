import batches from '../Models/batch.model.js';

export async function getBatch(request, response) {
    response.setHeader('content-type', 'application/json');

    try {
        const data = await batches.get(request.requestUrl.searchParams.get('id'));

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

export async function addBatch(request, response) {
    response.setHeader('content-type', 'application/json');

    try {
        const { batch_order, cart_arrayId } = request.data || {};

        if (!batch_order || !cart_arrayId) {
            response.write(
                JSON.stringify({
                    success: false,
                    message: 'Invalid data. Expecting `batch_order`, and `cart_arrayId`.',
                })
            );
            return response.end();
        }

        const data = await batches.add(batch_order, cart_arrayId);

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
