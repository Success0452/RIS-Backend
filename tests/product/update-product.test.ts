import { APIGatewayProxyEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import {updateProduct} from "../../src/functions/product/update-product";
import {verifyToken} from "../../src/util";
import Product from "../../src/models/product";
import {createResponse} from "../../src/util/response";

jest.mock('../../src/util/response');
jest.mock('../../src/util');
jest.mock('../../src/models/product');

describe('updateProduct function', () => {
    let event: Partial<APIGatewayProxyEvent>;

    beforeEach(() => {
        event = {
            headers: {
                Authorization: 'Bearer validtoken'
            },
            body: JSON.stringify({
                productId: 1,
                name: 'Updated Product',
                description: 'Updated Description',
                quantity: 20,
                price: 200,
                categoryId: 2
            })
        };
    });

    it('should return 400 if productId is not provided', async () => {
        event.body = JSON.stringify({});

        const result = await updateProduct(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.BAD_REQUEST,
            { statusCode: StatusCodes.BAD_REQUEST, message: 'productId not provided' }
        ));
    });

    it('should return 200 if product is updated successfully', async () => {
        const mockProduct = {
            toJSON: () => ({
                productId: 1,
                name: 'Original Product',
                description: 'Original Description',
                quantity: 10,
                price: 100,
                categoryId: 1
            }),
            save: jest.fn()
        };
        (verifyToken as jest.Mock).mockResolvedValue({ id: 1 });
        (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

        const result = await updateProduct(event as APIGatewayProxyEvent);

        expect(mockProduct.save).toHaveBeenCalled();
        expect(result).toEqual(createResponse(
            StatusCodes.OK,
            { statusCode: StatusCodes.OK, message: 'product updated successfully' }
        ));
    });

    it('should return 500 if there is an internal server error', async () => {
        (verifyToken as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

        const result = await updateProduct(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Internal Server Error' }
        ));
    });

    it('should return 500 if token verification fails', async () => {
        event.headers.Authorization = 'invalidtoken';
        (verifyToken as jest.Mock).mockRejectedValue(new Error('Token verification failed'));

        const result = await updateProduct(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Token verification failed' }
        ));
    });

    it('should return 500 if Authorization header is missing', async () => {
        event.headers = {};

        const result = await updateProduct(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: expect.any(String) }
        ));
    });

    it('should return 500 if product does not exist', async () => {
        (verifyToken as jest.Mock).mockResolvedValue({ id: 1 });
        (Product.findByPk as jest.Mock).mockResolvedValue(null);

        const result = await updateProduct(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Cannot read properties of null (reading \'toJSON\')' }
        ));
    });
});
