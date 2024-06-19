import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {StatusCodes} from "http-status-codes";
import {createResponse} from "../../util/response";
import {verifyToken} from "../../util";
import Categories from "../../models/categories";
import Product from "../../models/product";

export const addNewProduct = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const {name, description, quantity, price, categoryId } = JSON.parse(_event.body);
        const tokenRes = await verifyToken(_event.headers.Authorization || _event.headers.authorization);

        if(tokenRes.StatusCodes !== 200){
            return createResponse(
                StatusCodes.BAD_REQUEST,
                {statusCode: StatusCodes.BAD_REQUEST, message: tokenRes.message},
            )
        }

        const user = tokenRes.user;

        const category = await Categories.findByPk(categoryId);

        if(!category){
            return createResponse(
                StatusCodes.BAD_REQUEST,
                {statusCode: StatusCodes.BAD_REQUEST, message: `Invalid categoryId: ${categoryId}`},
            )
        }

        const categoryObject = category.toJSON();

        await Product.create({
            name: name,
            description: description,
            quantity: quantity,
            categoryId: categoryObject.id,
            price: price,
            userId: user.id
        });

        return createResponse(
            StatusCodes.CREATED,
            {
                statusCode: StatusCodes.CREATED,
                message: `product created successfully`,
            },
        )
    } catch (err) {
        return createResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            {statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: err.message},
        )
    }
};
