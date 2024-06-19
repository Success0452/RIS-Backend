import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {addNewCategory} from "../functions/category/add-category";
import {allCategories} from "../functions/category/all-categories";


export const addCategory = async (_event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    return addNewCategory(_event);
}

export const getListOfAllCategories = async (_event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    return allCategories(_event);
}
