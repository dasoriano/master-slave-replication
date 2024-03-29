import products from '../Models/product.model.js';

export async function getProduct(request, response) {
    response.setHeader('content-type', 'application/json');

    try {
        const data = await products.get(
            request.requestUrl.searchParams.get('id'),
            request.requestUrl.searchParams.get('seller-id')
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

export async function addProduct(request, response) {
    response.setHeader('content-type', 'application/json');

    try {
        const { seller_id, company_name, brand_name, description, variation, price, stock } =
            request.data || {};

        if (
            !seller_id ||
            !company_name ||
            !brand_name ||
            !description ||
            !variation ||
            !price ||
            !stock
        ) {
            response.write(
                JSON.stringify({
                    success: false,
                    message:
                        'Invalid data. Expecting `seller_id`, `company_name`, `brand_name`, `description`, `variation`, `price`, and `stock`.',
                })
            );
            return response.end();
        }

        const data = await products.add(
            seller_id,
            company_name,
            brand_name,
            description,
            variation,
            price,
            stock
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

export async function patProduct(request, response) {
    response.setHeader('content-type', 'application/json');

    try {
        const { id, seller_id, company_name, brand_name, description, variation, price, stock } =
            request.data || {};

        const data = await products.pat(
            id,
            seller_id,
            company_name,
            brand_name,
            description,
            variation,
            price,
            stock
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

export async function delProduct(request, response) {
    response.setHeader('content-type', 'application/json');

    try {
        const { id, seller_id } = request.data || {};

        const data = await products.del(id, seller_id);

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
