import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {StatusCodes} from "http-status-codes";
import {createResponse} from "../../util/response";
import {generateToken, verifyPassword} from "../../util";
import User from "../../models/user";

export default async function login(event:APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const {username, password} = JSON.parse(event.body);

        if(!username || !password) {
            return createResponse(
                StatusCodes.UNAUTHORIZED,
                {statusCode: StatusCodes.UNAUTHORIZED, message: `Invalid username or password`},
            )
        }

        const user = await User.findOne({where: {username: username}});

        if(!user){
            return createResponse(
                StatusCodes.NOT_FOUND,
                { message: 'username is not registered', statusCode: StatusCodes.NOT_FOUND }
            );
        }

        const userObject = user.toJSON();

        const verifiedPassword = await verifyPassword(userObject.password, password);

        if(!verifiedPassword){
            return createResponse(
                StatusCodes.BAD_REQUEST,
                { message: 'incorrect password', statusCode: StatusCodes.BAD_REQUEST }
            );
        }

        await user.update({ active: true });

        return createResponse(
            StatusCodes.OK,
            {
                statusCode: StatusCodes.OK,
                message: `login successful`,
                id: userObject.id,
                username: userObject.username,
                token: generateToken(userObject.id),
            },
        )
    } catch (err) {
        return createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            {statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: err.message},
        )
    }
};
