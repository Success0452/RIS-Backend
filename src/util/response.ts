export const createResponse = (statusCode: number, body: any) => {
    return {
        statusCode: statusCode,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    }
}
