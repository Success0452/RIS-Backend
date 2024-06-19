import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {StatusCodes} from "http-status-codes";
import {createResponse} from "../../util/response";
import {verifyToken} from "../../util";

export default async function logout (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const tokenRes = await verifyToken(_event.headers.Authorization || _event.headers.authorization);

        if(tokenRes.StatusCodes !== 200){
            return createResponse(
                StatusCodes.BAD_REQUEST,
                {statusCode: StatusCodes.BAD_REQUEST, message: tokenRes.message},
            )
        }

        const user = await tokenRes.user.toJSON();

        if(!user.active){
            return createResponse(
                StatusCodes.BAD_REQUEST,
                {statusCode: StatusCodes.BAD_REQUEST, message: `user is not currently loggedIn`},
            )
        }

        await tokenRes.user.update({ active: false });

        return createResponse(
            StatusCodes.OK,
            {
                statusCode: StatusCodes.OK,
                message: `user has been loggedOut successfully`
            },
        )
    } catch (err) {
        return createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            {statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: err.message},
        )
    }
};
