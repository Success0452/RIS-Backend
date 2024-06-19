import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {StatusCodes} from "http-status-codes";
import {createResponse} from "../../util/response";
import {generateToken, hashPassword} from "../../util";
import User from "../../models/user";

export default async  function createAccount (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const {username, password} = JSON.parse(_event.body);

        if(!username || !password) {
            return createResponse(
                StatusCodes.BAD_REQUEST,
                {statusCode: StatusCodes.BAD_REQUEST, message: `Invalid username or password`},
            )
        }

        const checkExistingUser = await User.findOne({where: {username: username}});

        if(checkExistingUser) {
            return createResponse(
                StatusCodes.BAD_REQUEST,
                {statusCode: StatusCodes.BAD_REQUEST, message: `username already taken, please use another username`},
            )
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({username: username, password: hashedPassword});
        const userConfig = user.toJSON();
        return createResponse(
            StatusCodes.CREATED,
            {
                statusCode: StatusCodes.CREATED,
                message: `account created successfully`,
                id: userConfig.id,
                username: userConfig.username,
                token: generateToken(userConfig.id),
            },
        )
    } catch (err) {
        return createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            {statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: err.message},
        )
    }
};
