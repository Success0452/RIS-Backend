import { APIGatewayProxyEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import {verifyToken} from "../../src/util";
import logout from "../../src/functions/user/logout";
import {createResponse} from "../../src/util/response";

jest.mock('../../src/util/response');
jest.mock('../../src/util');

describe('logout function', () => {
    let event: Partial<APIGatewayProxyEvent>;

    beforeEach(() => {
        event = {
            headers: {
                Authorization: 'Bearer validtoken'
            }
        };
    });

    it('should return 400 if user is not active', async () => {
        const mockUser = { active: false, save: jest.fn() };
        (verifyToken as jest.Mock).mockResolvedValue(mockUser);

        const result = await logout(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.BAD_REQUEST,
            { statusCode: StatusCodes.BAD_REQUEST, message: 'user is not currently loggedIn' }
        ));
    });

    it('should return 200 if logout is successful', async () => {
        const mockUser = { active: true, save: jest.fn() };
        (verifyToken as jest.Mock).mockResolvedValue(mockUser);

        const result = await logout(event as APIGatewayProxyEvent);

        expect(mockUser.active).toBe(false);
        expect(mockUser.save).toHaveBeenCalled();
        expect(result).toEqual(createResponse(
            StatusCodes.OK,
            { statusCode: StatusCodes.OK, message: 'user has been loggedOut successfully' }
        ));
    });

    it('should return 500 if there is an internal server error', async () => {
        (verifyToken as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

        const result = await logout(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Internal Server Error' }
        ));
    });

    it('should return 500 if token verification fails', async () => {
        event.headers.Authorization = 'invalidtoken';
        (verifyToken as jest.Mock).mockRejectedValue(new Error('Token verification failed'));

        const result = await logout(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Token verification failed' }
        ));
    });

    it('should return 500 if Authorization header is missing', async () => {
        event.headers = {};

        const result = await logout(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: expect.any(String) }
        ));
    });
});
