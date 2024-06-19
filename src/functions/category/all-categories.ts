import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {StatusCodes} from "http-status-codes";
import {createResponse} from "../../util/response";
import {verifyToken} from "../../util";
import Categories from "../../models/categories";

export const allCategories = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const tokenRes = await verifyToken(_event.headers.Authorization || _event.headers.authorization);

        if(tokenRes.StatusCodes !== 200){
            return createResponse(
                StatusCodes.BAD_REQUEST,
                {statusCode: StatusCodes.BAD_REQUEST, message: tokenRes.message},
            )
        }

        const categories = await Categories.findAll();

        return createResponse(
            StatusCodes.OK,
            {
                statusCode: StatusCodes.OK,
                message: `categories fetched successfully`,
                data: categories,
            },
        )
    } catch (err) {
        return createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            {statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: err.message},
        )
    }
};
