import { APIGatewayProxyEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import {verifyToken} from "../../src/util";
import {createResponse} from "../../src/util/response";
import {deleteProduct} from "../../src/functions/product/delete-product";
import Product from "../../src/models/product";

jest.mock('../../src/util/response');
jest.mock('../../src/util');
jest.mock('../../src/models/product');

describe('deleteProduct function', () => {
    let event: Partial<APIGatewayProxyEvent>;

    beforeEach(() => {
        jest.useFakeTimers();
        event = {
            headers: {
                Authorization: 'Bearer validtoken'
            },
            body: JSON.stringify({ productId: '1' })
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

        const result = await deleteProduct(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.BAD_REQUEST,
            { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid token' }
        ));
    });

    it('should return 400 if productId is not provided', async () => {
        event.body = JSON.stringify({});

        (verifyToken as jest.Mock).mockResolvedValue({
            StatusCodes: StatusCodes.OK,
            user: {}
        });

        const result = await deleteProduct(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.BAD_REQUEST,
            { statusCode: StatusCodes.BAD_REQUEST, message: 'productId not provided' }
        ));
    });

    it('should return 200 if product is deleted successfully', async () => {
        const mockProduct = {
            destroy: jest.fn().mockResolvedValue({})
        };
        (verifyToken as jest.Mock).mockResolvedValue({
            StatusCodes: StatusCodes.OK,
            user: {}
        });
        (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

        const result = await deleteProduct(event as APIGatewayProxyEvent);

        expect(mockProduct.destroy).toHaveBeenCalled();
        expect(result).toEqual(createResponse(
            StatusCodes.OK,
            { statusCode: StatusCodes.OK, message: 'product deleted successfully' }
        ));
    });

    it('should return 500 if there is an internal server error', async () => {
        (verifyToken as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

        const result = await deleteProduct(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Internal Server Error' }
        ));
    });
});
