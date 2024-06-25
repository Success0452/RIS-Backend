import { APIGatewayProxyEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import {verifyToken} from "../../src/util";
import {allCategories} from "../../src/functions/category/all-categories";
import {createResponse} from "../../src/util/response";
import Categories from "../../src/models/categories";

jest.mock('../../src/util/response');
jest.mock('../../src/util');
jest.mock('../../src/models/categories');

describe('allCategories function', () => {
    let event: Partial<APIGatewayProxyEvent>;

    beforeEach(() => {
        jest.useFakeTimers();
        event = {
            headers: {
                Authorization: 'Bearer validtoken'
            }
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

        const result = await allCategories(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.BAD_REQUEST,
            { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid token' }
        ));
    });

    it('should return 200 and fetch categories successfully', async () => {
        const mockCategories = [{ id: 1, name: 'Category1' }, { id: 2, name: 'Category2' }];
        (verifyToken as jest.Mock).mockResolvedValue({
            StatusCodes: StatusCodes.OK,
            user: {}
        });
        (Categories.findAll as jest.Mock).mockResolvedValue(mockCategories);

        const result = await allCategories(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.OK,
            {
                statusCode: StatusCodes.OK,
                message: 'categories fetched successfully',
                data: mockCategories
            }
        ));
    });

    it('should return 500 if there is an internal server error', async () => {
        (verifyToken as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

        const result = await allCategories(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Internal Server Error' }
        ));
    });
});
