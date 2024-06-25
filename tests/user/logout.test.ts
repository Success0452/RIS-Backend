import { APIGatewayProxyEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import {verifyToken} from "../../src/util";
import {createResponse} from "../../src/util/response";
import logout from "../../src/functions/user/logout";

jest.mock('../../src/util/response');
jest.mock('../../src/util');

describe('logout function', () => {
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

        const result = await logout(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.BAD_REQUEST,
            { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid token' }
        ));
    });

    it('should return 400 if user is not active', async () => {
        const mockUser = { toJSON: () => ({ active: false }) };
        (verifyToken as jest.Mock).mockResolvedValue({
            StatusCodes: StatusCodes.OK,
            user: mockUser
        });

        const result = await logout(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.BAD_REQUEST,
            { statusCode: StatusCodes.BAD_REQUEST, message: 'user is not currently loggedIn' }
        ));
    });

    it('should return 200 if logout is successful', async () => {
        const mockUser = {
            toJSON: () => ({ active: true }),
            update: jest.fn().mockResolvedValue({})
        };
        (verifyToken as jest.Mock).mockResolvedValue({
            StatusCodes: StatusCodes.OK,
            user: mockUser
        });

        const result = await logout(event as APIGatewayProxyEvent);

        expect(mockUser.update).toHaveBeenCalledWith({ active: false });
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
});
