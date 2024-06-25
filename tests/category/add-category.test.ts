import { APIGatewayProxyEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import {verifyToken} from "../../src/util";
import {addNewCategory} from "../../src/functions/category/add-category";
import {createResponse} from "../../src/util/response";
import Categories from "../../src/models/categories";

jest.mock('../../src/util/response');
jest.mock('../../src/util');
jest.mock('../../src/models/categories');

describe('addNewCategory function', () => {
    let event: Partial<APIGatewayProxyEvent>;

    beforeEach(() => {
        jest.useFakeTimers();
        event = {
            headers: {
                Authorization: 'Bearer validtoken'
            },
            body: JSON.stringify({ name: 'New Category' })
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

        const result = await addNewCategory(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.BAD_REQUEST,
            { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid token' }
        ));
    });

    it('should return 400 if name is not provided', async () => {
        event.body = JSON.stringify({});

        (verifyToken as jest.Mock).mockResolvedValue({
            StatusCodes: StatusCodes.OK,
            user: {}
        });

        const result = await addNewCategory(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.BAD_REQUEST,
            { statusCode: StatusCodes.BAD_REQUEST, message: 'please name field is required' }
        ));
    });

    it('should return 400 if category with same name already exists', async () => {
        (verifyToken as jest.Mock).mockResolvedValue({
            StatusCodes: StatusCodes.OK,
            user: {}
        });
        (Categories.findOne as jest.Mock).mockResolvedValue({});

        const result = await addNewCategory(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.BAD_REQUEST,
            { statusCode: StatusCodes.BAD_REQUEST, message: 'category with same name already exists' }
        ));
    });

    it('should return 201 if category is created successfully', async () => {
        (verifyToken as jest.Mock).mockResolvedValue({
            StatusCodes: StatusCodes.OK,
            user: { id: 1 }
        });
        (Categories.findOne as jest.Mock).mockResolvedValue(null);
        (Categories.create as jest.Mock).mockResolvedValue({});

        const result = await addNewCategory(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.CREATED,
            { statusCode: StatusCodes.CREATED, message: 'category created successfully' }
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
});
