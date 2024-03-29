import transactions from '../Models/transaction.model.js';

export async function getTransaction(request, response) {
    response.setHeader('content-type', 'application/json');

    try {
        const data = await transactions.get(
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
