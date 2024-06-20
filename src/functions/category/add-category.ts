import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {StatusCodes} from "http-status-codes";
import {createResponse} from "../../util/response";
import {verifyToken} from "../../util";
import Categories from "../../models/categories";

export const addNewCategory = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const {name} = JSON.parse(_event.body);
        const tokenRes = await verifyToken(_event.headers.Authorization || _event.headers.authorization);
        if(tokenRes.StatusCodes !== 200){
            return createResponse(
                StatusCodes.BAD_REQUEST,
                {statusCode: StatusCodes.BAD_REQUEST, message: tokenRes.message},
            )
        }

        if(!name){
            return createResponse(
                StatusCodes.BAD_REQUEST,
                {statusCode: StatusCodes.BAD_REQUEST, message: 'please name field is required'},
            )
        }

        const user = tokenRes.user;

        const checkExistingName = await Categories.findOne({where: {name: name}});

        if(checkExistingName) {
            return createResponse(
                StatusCodes.BAD_REQUEST,
                {statusCode: StatusCodes.BAD_REQUEST, message: `category with same name already exists`},
            )
        }

        await Categories.create({
            name: name,
            userId: user.id
        });

        return createResponse(
            StatusCodes.CREATED,
            {
                statusCode: StatusCodes.CREATED,
                message: `category created successfully`,
            },
        )
    } catch (err) {
        return createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            {statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: err.message},
        )
    }
};
