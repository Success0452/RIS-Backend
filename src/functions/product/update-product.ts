import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {StatusCodes} from "http-status-codes";
import {createResponse} from "../../util/response";
import {verifyToken} from "../../util";
import Product from "../../models/product";

export const updateProduct = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const {productId, name, description, quantity, price, categoryId} = JSON.parse(_event.body);
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
        const productObject = await product.toJSON();

        await product.update({
            name: name ?? productObject.name,
            description: description ?? productId.description,
            quantity: quantity ?? productObject.quantity,
            categoryId: categoryId ?? productObject.categoryId,
            price: price ?? productObject.price
        });

        return createResponse(
            StatusCodes.OK,
            {
                statusCode: StatusCodes.OK,
                message: `product updated successfully`
            },
        )
    } catch (err) {
        return createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            {statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: err.message},
        )
    }
};
