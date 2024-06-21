import { APIGatewayProxyEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import {createResponse} from "../../src/util/response";
import login from "../../src/functions/user/login";
import User from "../../src/models/user";
import {generateToken, verifyPassword} from "../../src/util";
import * as iconv from 'iconv-lite';
iconv.encodingExists('foo');

jest.mock('../../src/models/user');
jest.mock('../../src/util/response');
jest.mock('../../src/util');

describe('login function', () => {
    let event: Partial<APIGatewayProxyEvent>;

    beforeEach(() => {
        jest.useFakeTimers();
        event = {
            body: JSON.stringify({
                username: 'testuser',
                password: 'testpassword'
            })
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 if username or password is missing', async () => {
        event.body = JSON.stringify({});

        const result = await login(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.UNAUTHORIZED,
            { statusCode: StatusCodes.UNAUTHORIZED, message: 'Invalid username or password' }
        ));
    });

    it('should return 404 if user is not found', async () => {
        const result = await login(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.NOT_FOUND,
            { message: 'username is not registered', statusCode: StatusCodes.NOT_FOUND }
        ));
    });

    it('should return 400 if password is incorrect', async () => {
        const mockUser = { toJSON: () => ({ password: 'hashedpassword' }) };
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (verifyPassword as jest.Mock).mockResolvedValue(false);

        const result = await login(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.BAD_REQUEST,
            { message: 'incorrect password', statusCode: StatusCodes.BAD_REQUEST }
        ));
    });

    it('should return 200 and a token if login is successful', async () => {
        const mockUser = { id: 1, username: 'testuser', password: 'hashedpassword', toJSON: () => ({ id: 1, username: 'testuser', password: 'hashedpassword' }) };
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (verifyPassword as jest.Mock).mockResolvedValue(true);
        (generateToken as jest.Mock).mockReturnValue('token');

        const result = await login(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.OK,
            {
                statusCode: StatusCodes.OK,
                message: 'login successful',
                id: mockUser.id,
                username: mockUser.username,
                token: 'token'
            }
        ));
    });

    it('should return 500 if there is an internal server error', async () => {
        (User.findOne as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

        const result = await login(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Internal Server Error' }
        ));
    });
});
