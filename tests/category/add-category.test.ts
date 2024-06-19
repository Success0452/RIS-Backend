import { APIGatewayProxyEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import {addNewCategory} from "../../src/functions/category/add-category";
import {createResponse} from "../../src/util/response";
import {verifyToken} from "../../src/util";
import Categories from "../../src/models/categories";

jest.mock('../../src/util/response');
jest.mock('../../src/util');
jest.mock('../../src/models/categories');

describe('addNewCategory function', () => {
    let event: Partial<APIGatewayProxyEvent>;

    beforeEach(() => {
        event = {
            headers: {
                Authorization: 'Bearer validtoken'
            },
            body: JSON.stringify({
                name: 'New Category'
            })
        };
    });

    it('should return 400 if name is not provided', async () => {
        event.body = JSON.stringify({});

        const result = await addNewCategory(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.BAD_REQUEST,
            { statusCode: StatusCodes.BAD_REQUEST, message: 'name not provided' }
        ));
    });

    it('should return 200 if category is created successfully', async () => {
        (verifyToken as jest.Mock).mockResolvedValue({ id: 1 });
        (Categories.create as jest.Mock).mockResolvedValue({});

        const result = await addNewCategory(event as APIGatewayProxyEvent);

        expect(Categories.create).toHaveBeenCalledWith({
            name: 'New Category',
            userId: 1
        });
        expect(result).toEqual(createResponse(
            StatusCodes.OK,
            { statusCode: StatusCodes.OK, message: 'category created successfully' }
        ));
    });

    it('should return 500 if there is an internal server error', async () => {
        (verifyToken as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

        const result = await addNewCategory(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Internal Server Error' }
        ));
    });

    it('should return 500 if token verification fails', async () => {
        event.headers.Authorization = 'invalidtoken';
        (verifyToken as jest.Mock).mockRejectedValue(new Error('Token verification failed'));

        const result = await addNewCategory(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Token verification failed' }
        ));
    });

    it('should return 500 if Authorization header is missing', async () => {
        event.headers = {};

        const result = await addNewCategory(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: expect.any(String) }
        ));
    });
});
