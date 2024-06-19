import { APIGatewayProxyEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import {verifyToken} from "../../src/util";
import Categories from "../../src/models/categories";
import {createResponse} from "../../src/util/response";
import {allCategories} from "../../src/functions/category/all-categories";

jest.mock('../../src/util/response');
jest.mock('../../src/util');
jest.mock('../../src/models/categories');

describe('allCategories function', () => {
    let event: Partial<APIGatewayProxyEvent>;

    beforeEach(() => {
        event = {
            headers: {
                Authorization: 'Bearer validtoken'
            }
        };
    });

    it('should return 200 if categories are fetched successfully', async () => {
        const mockCategories = [
            { id: 1, name: 'Category 1' },
            { id: 2, name: 'Category 2' }
        ];
        (verifyToken as jest.Mock).mockResolvedValue({ id: 1 });
        (Categories.findAll as jest.Mock).mockResolvedValue(mockCategories);

        const result = await allCategories(event as APIGatewayProxyEvent);

        expect(Categories.findAll).toHaveBeenCalled();
        expect(result).toEqual(createResponse(
            StatusCodes.OK,
            {
                statusCode: StatusCodes.OK,
                message: 'categories fetched successfully',
                data: mockCategories,
            }
        ));
    });

    it('should return 500 if token verification fails', async () => {
        event.headers.Authorization = 'invalidtoken';
        (verifyToken as jest.Mock).mockRejectedValue(new Error('Token verification failed'));

        const result = await allCategories(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Token verification failed' }
        ));
    });

    it('should return 500 if there is an internal server error', async () => {
        (verifyToken as jest.Mock).mockResolvedValue({ id: 1 });
        (Categories.findAll as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

        const result = await allCategories(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Internal Server Error' }
        ));
    });

    it('should return 500 if Authorization header is missing', async () => {
        event.headers = {};

        const result = await allCategories(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: expect.any(String) }
        ));
    });
});
