import { APIGatewayProxyEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import {verifyToken} from "../../src/util";
import Product from "../../src/models/product";
import {allProducts} from "../../src/functions/product/all-products";
import {createResponse} from "../../src/util/response";

jest.mock('../../src/util/response');
jest.mock('../../src/util');
jest.mock('../../src/models/product');

describe('allProducts function', () => {
    let event: Partial<APIGatewayProxyEvent>;

    beforeEach(() => {
        event = {
            headers: {
                Authorization: 'Bearer validtoken'
            }
        };
    });

    it('should return 200 and fetch all products successfully', async () => {
        const mockProducts = [
            { id: 1, name: 'Product 1', description: 'Description 1', price: 100 },
            { id: 2, name: 'Product 2', description: 'Description 2', price: 200 },
        ];
        (verifyToken as jest.Mock).mockResolvedValue({ id: 1 });
        (Product.findAll as jest.Mock).mockResolvedValue(mockProducts);

        const result = await allProducts(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.OK,
            {
                statusCode: StatusCodes.OK,
                message: 'products fetched successfully',
                data: mockProducts,
            }
        ));
    });

    it('should return 200 and an empty array if no products are found', async () => {
        (verifyToken as jest.Mock).mockResolvedValue({ id: 1 });
        (Product.findAll as jest.Mock).mockResolvedValue([]);

        const result = await allProducts(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.OK,
            {
                statusCode: StatusCodes.OK,
                message: 'products fetched successfully',
                data: [],
            }
        ));
    });

    it('should return 500 if there is an internal server error', async () => {
        (verifyToken as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

        const result = await allProducts(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Internal Server Error' }
        ));
    });

    it('should return 500 if token verification fails', async () => {
        event.headers.Authorization = 'invalidtoken';
        (verifyToken as jest.Mock).mockRejectedValue(new Error('Token verification failed'));

        const result = await allProducts(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Token verification failed' }
        ));
    });

    it('should return 500 if Authorization header is missing', async () => {
        event.headers = {};

        const result = await allProducts(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: expect.any(String) }
        ));
    });
});
