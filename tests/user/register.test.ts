import { APIGatewayProxyEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import createAccount from "../../src/functions/user/create-account";
import {createResponse} from "../../src/util/response";
import User from "../../src/models/user";
import {generateToken, hashPassword} from "../../src/util";

jest.mock('../../src/util/response');
jest.mock('../../src/util');
jest.mock('../../src/models/user');

describe('createAccount function', () => {
    let event: Partial<APIGatewayProxyEvent>;

    beforeEach(() => {
        event = {
            body: JSON.stringify({
                username: 'testuser',
                password: 'testpassword'
            })
        };
    });

    it('should return 400 if username or password is missing', async () => {
        event.body = JSON.stringify({});

        const result = await createAccount(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.BAD_REQUEST,
            { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid username or password' }
        ));
    });

    it('should return 400 if username already exists', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({});

        const result = await createAccount(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.BAD_REQUEST,
            { statusCode: StatusCodes.BAD_REQUEST, message: 'username already taken, please use another username' }
        ));
    });

    it('should return 201 if account creation is successful', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (hashPassword as jest.Mock).mockResolvedValue('hashedpassword');
        (User.create as jest.Mock).mockResolvedValue({
            toJSON: () => ({
                id: 1,
                username: 'testuser',
                password: 'hashedpassword'
            })
        });
        (generateToken as jest.Mock).mockReturnValue('token');

        const result = await createAccount(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.CREATED,
            {
                statusCode: StatusCodes.CREATED,
                message: 'account created successfully',
                id: 1,
                username: 'testuser',
                token: 'token'
            }
        ));
    });

    it('should return 500 if there is an internal server error', async () => {
        (User.findOne as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

        const result = await createAccount(event as APIGatewayProxyEvent);

        expect(result).toEqual(createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Internal Server Error' }
        ));
    });
});
