"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.verifyPassword = exports.hashPassword = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const http_status_codes_1 = require("http-status-codes");
const user_1 = require("../models/user");
const console = require("node:console");
const hashPassword = async (password) => {
    const salt = await (0, bcryptjs_1.genSalt)(10);
    return await (0, bcryptjs_1.hash)(password, salt);
};
exports.hashPassword = hashPassword;
const verifyPassword = async (hashedPassword, newPassword) => {
    return await (0, bcryptjs_1.compare)(newPassword, hashedPassword);
};
exports.verifyPassword = verifyPassword;
const generateToken = (id) => {
    const result = (0, jsonwebtoken_1.sign)({ id }, process.env.JWT_SECRET, { 'expiresIn': '30d' });
    console.log(result);
    return result;
};
exports.generateToken = generateToken;
const verifyToken = async (currentToken) => {
    if (!currentToken || !currentToken.startsWith("Bearer ")) {
        return {
            StatusCodes: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: 'Invalid token format',
        };
    }
    const token = currentToken.split(" ")[1];
    let userConfig;
    try {
        userConfig = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
    }
    catch (err) {
        return {
            StatusCodes: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: 'Token verification failed',
        };
    }
    const user = await user_1.default.findByPk(userConfig.id);
    if (!user) {
        return {
            StatusCodes: http_status_codes_1.StatusCodes.NOT_FOUND,
            message: 'user not found',
        };
    }
    const userObject = user.toJSON();
    if (!userObject.active) {
        return {
            StatusCodes: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: 'user is loggedOut, please login again',
        };
    }
    return {
        StatusCodes: http_status_codes_1.StatusCodes.OK,
        message: 'proceed',
        user: user,
    };
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=index.js.map