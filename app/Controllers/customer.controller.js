import customers from '../Models/customer.model.js';

export async function getCustomer(request, response) {
    response.setHeader('content-type', 'application/json');

    try {
        const data = await customers.get(request.requestUrl.searchParams.get('id'));
        
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

export async function addCustomer(request, response) {
    response.setHeader('content-type', 'application/json');

    try {
        const { username, password, surname, first_name, email } = request.data || {};
        
        if (!username || !password || !surname || !first_name || !email) {
            response.write(
                JSON.stringify({
                    success: false,
                    message: 'Invalid data. Expecting `username`, `password`, `surname`, `first_name`, and `email`.',
                })
            );
            return response.end();
        }

        const data = await customers.add(username, password, surname, first_name, email);

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

export async function patCustomer(request, response) {
    response.setHeader('content-type', 'application/json');

    try {
        const {
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
            shop_name,
        } = request.data || {};

        const data = await customers.pat(
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

export async function delCustomer(request, response) {
    response.setHeader('content-type', 'application/json');

    try {
        const { id } = request.data || {};

        if (!id) {
            response.write(
                JSON.stringify({
                    success: false,
                    message: 'Invalid data. Expecting `id`.',
                })
            );
            return response.end();
        }

        const data = await customers.del(id);

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
