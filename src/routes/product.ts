import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {addNewProduct} from "../functions/product/add-product";
import {allProducts} from "../functions/product/all-products";
import {deleteProduct} from "../functions/product/delete-product";
import {updateProduct} from "../functions/product/update-product";

export const addProduct = async (_event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    return addNewProduct(_event);
}

export const getListOfProducts = async (_event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    return allProducts(_event);
}

export const deleteExistingProduct = async (_event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    return deleteProduct(_event);
}

export const updateExistingProduct = async (_event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    return updateProduct(_event);
}
