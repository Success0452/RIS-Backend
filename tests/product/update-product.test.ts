import { APIGatewayProxyEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import {verifyToken} from "../../src/util";
import {updateProduct} from "../../src/functions/product/update-product";
import {createResponse} from "../../src/util/response";
import Product from "../../src/models/product";

jest.mock('../../src/util/response');
jest.mock('../../src/util');
jest.mock('../../src/models/product');

describe('updateProduct function', () => {
    let event: Partial<APIGatewayProxyEvent>;

    beforeEach(() => {
        jest.useFakeTimers();
        event = {
            headers: {
                Authorization: 'Bearer validtoken'
            },
            body: JSON.stringify({
                productId: '1',
                name: 'New Product Name',
                description: 'New Description',
                quantity: 10,
                price: 20.0,
                categoryId: '2'
            })
        };
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.clearAllMocks();
    });

    it('should return 400 if token verification fails', async () => {
        (verifyToken as jest.Mock).mockResolvedValue({
            StatusCodes: StatusCodes.BAD_REQUEST,
            message: 'Invalid token'
        });

        const result = await updateProduct(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.BAD_REQUEST,
            { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid token' }
        ));
    });

    it('should return 400 if productId is not provided', async () => {
        event.body = JSON.stringify({
            name: 'New Product Name',
            description: 'New Description',
            quantity: 10,
            price: 20.0,
            categoryId: '2'
        });

        (verifyToken as jest.Mock).mockResolvedValue({
            StatusCodes: StatusCodes.OK,
            user: {}
        });

        const result = await updateProduct(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.BAD_REQUEST,
            { statusCode: StatusCodes.BAD_REQUEST, message: 'productId not provided' }
        ));
    });

    it('should return 200 if product is updated successfully', async () => {
        const mockProduct = {
            toJSON: jest.fn().mockReturnValue({
                name: 'Old Product Name',
                description: 'Old Description',
                quantity: 5,
                price: 15.0,
                categoryId: '1'
            }),
            update: jest.fn().mockResolvedValue({})
        };
        (verifyToken as jest.Mock).mockResolvedValue({
            StatusCodes: StatusCodes.OK,
            user: {}
        });
        (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

        const result = await updateProduct(event as APIGatewayProxyEvent);

        expect(mockProduct.update).toHaveBeenCalledWith({
            name: 'New Product Name',
            description: 'New Description',
            quantity: 10,
            price: 20.0,
            categoryId: '2'
        });
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
});
