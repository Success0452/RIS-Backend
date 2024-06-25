"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../util/response");
const util_1 = require("../../util");
const user_1 = require("../../models/user");
async function login(event) {
    try {
        const { username, password } = JSON.parse(event.body);
        if (!username || !password) {
            return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.UNAUTHORIZED, { statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED, message: `Invalid username or password` });
        }
        const user = await user_1.default.findOne({ where: { username: username } });
        if (!user) {
            return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.NOT_FOUND, { message: 'username is not registered', statusCode: http_status_codes_1.StatusCodes.NOT_FOUND });
        }
        const userObject = user.toJSON();
        const verifiedPassword = await (0, util_1.verifyPassword)(userObject.password, password);
        if (!verifiedPassword) {
            return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.BAD_REQUEST, { message: 'incorrect password', statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST });
        }
        await user.update({ active: true });
        return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.OK, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: `login successful`,
            id: userObject.id,
            username: userObject.username,
            token: (0, util_1.generateToken)(userObject.id),
        });
    }
    catch (err) {
        return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, { statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: err.message });
    }
}
exports.default = login;
;
//# sourceMappingURL=login.js.map