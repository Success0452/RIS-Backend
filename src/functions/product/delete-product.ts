import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {StatusCodes} from "http-status-codes";
import {createResponse} from "../../util/response";
import {verifyToken} from "../../util";
import Product from "../../models/product";

export const deleteProduct = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const {productId} = JSON.parse(_event.body);

        const tokenRes = await verifyToken(_event.headers.Authorization || _event.headers.authorization);

        if(tokenRes.StatusCodes !== 200){
            return createResponse(
                StatusCodes.BAD_REQUEST,
                {statusCode: StatusCodes.BAD_REQUEST, message: tokenRes.message},
            )
        }

        if(!productId){
            return createResponse(
                StatusCodes.BAD_REQUEST,
                {statusCode: StatusCodes.BAD_REQUEST, message: `productId not provided`},
            )
        }

        const product = await Product.findByPk(productId);

        await product.destroy();

        return createResponse(
            StatusCodes.OK,
            {
                statusCode: StatusCodes.OK,
                message: `product deleted successfully`
            },
        )
    } catch (err) {
        return createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            {statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: err.message},
        )
    }
};
