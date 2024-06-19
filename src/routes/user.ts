import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import createAccount from "../functions/user/create-account";
import logout from "../functions/user/logout";
import login from "../functions/user/login";

export const registerAccount = async (_event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    return createAccount(_event);
}

export const loginAccount = async (_event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    return login(_event);
}

export const logoutAccount = async (_event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    return logout(_event);
}
