import {compare, genSalt, hash} from 'bcryptjs';
import {sign, verify} from 'jsonwebtoken';
import {StatusCodes} from "http-status-codes";
import User from "../models/user";
import * as console from "node:console";

export const hashPassword = async(password: string): Promise<string> => {
    const salt = await genSalt(10);
    return await hash(password, salt);
}

export const verifyPassword = async(hashedPassword: string, newPassword: string): Promise<boolean> => {
    return await compare(newPassword, hashedPassword);
}

export const generateToken = (id:number) => {
    const result = sign({ id }, process.env.JWT_SECRET, {'expiresIn': '30d'});
    console.log(result);
    return result;
}

export const verifyToken = async (currentToken: string): Promise<any> => {
    if (!currentToken || !currentToken.startsWith("Bearer ")) {
        return {
            StatusCodes: StatusCodes.BAD_REQUEST,
            message: 'Invalid token format',
        }
    }

    const token = currentToken.split(" ")[1];

    let userConfig: any;
    try {
        userConfig = verify(token, process.env.JWT_SECRET as string);
    } catch (err) {
        return {
            StatusCodes: StatusCodes.UNAUTHORIZED,
            message: 'Token verification failed',
        }
    }
    const user = await User.findByPk(userConfig.id);
    if (!user) {
        return {
            StatusCodes: StatusCodes.NOT_FOUND,
            message: 'user not found',
        }
    }

    const userObject = user.toJSON();

    if(!userObject.active){
        return {
            StatusCodes: StatusCodes.BAD_REQUEST,
            message: 'user is loggedOut, please login again',
        }
    }

    return {
        StatusCodes: StatusCodes.OK,
        message: 'proceed',
        user: user,
    };
};
