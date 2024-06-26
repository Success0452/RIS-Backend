import { APIGatewayProxyEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import {createResponse} from "../../src/util/response";
import {addNewProduct} from "../../src/functions/product/add-product";
import {verifyToken} from "../../src/util";
import Categories from "../../src/models/categories";
import Product from "../../src/models/product";

jest.mock('../../src/util/response');
jest.mock('../../src/util');
jest.mock('../../src/models/categories');
jest.mock('../../src/models/product');

describe('addNewProduct function', () => {
    let event: Partial<APIGatewayProxyEvent>;

    beforeEach(() => {
        event = {
            headers: {
                Authorization: 'Bearer validtoken'
            },
            body: JSON.stringify({
                name: 'Test Product',
                description: 'Test Description',
                quantity: 10,
                price: 100,
                categoryId: 1
            })
        };
    });

    it('should return 400 if categoryId is invalid', async () => {
        (verifyToken as jest.Mock).mockResolvedValue({ id: 1 });
        (Categories.findByPk as jest.Mock).mockResolvedValue(null);

        const result = await addNewProduct(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.BAD_REQUEST,
            { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid categoryId: 1' }
        ));
    });

    it('should return 200 if product creation is successful', async () => {
        (verifyToken as jest.Mock).mockResolvedValue({ id: 1 });
        (Categories.findByPk as jest.Mock).mockResolvedValue({
            toJSON: () => ({ id: 1 })
        });
        (Product.create as jest.Mock).mockResolvedValue({});

        const result = await addNewProduct(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.OK,
            { statusCode: StatusCodes.OK, message: 'product created successfully' }
        ));
    });

    it('should return 500 if there is an internal server error', async () => {
        (verifyToken as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

        const result = await addNewProduct(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Internal Server Error' }
        ));
    });

    it('should return 500 if token verification fails', async () => {
        event.headers.Authorization = 'invalidtoken';
        (verifyToken as jest.Mock).mockRejectedValue(new Error('Token verification failed'));

        const result = await addNewProduct(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Token verification failed' }
        ));
    });

    it('should return 500 if Authorization header is missing', async () => {
        event.headers = {};

        const result = await addNewProduct(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: expect.any(String) }
        ));
    });
});
