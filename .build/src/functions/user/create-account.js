"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../util/response");
const util_1 = require("../../util");
const user_1 = require("../../models/user");
async function createAccount(_event) {
    try {
        const { username, password } = JSON.parse(_event.body);
        if (!username || !password) {
            return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.BAD_REQUEST, { statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST, message: `Invalid username or password` });
        }
        const checkExistingUser = await user_1.default.findOne({ where: { username: username } });
        if (checkExistingUser) {
            return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.BAD_REQUEST, { statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST, message: `username already taken, please use another username` });
        }
        const hashedPassword = await (0, util_1.hashPassword)(password);
        const user = await user_1.default.create({ username: username, password: hashedPassword });
        const userConfig = user.toJSON();
        return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.CREATED, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            message: `account created successfully`,
            id: userConfig.id,
            username: userConfig.username,
            token: (0, util_1.generateToken)(userConfig.id),
        });
    }
    catch (err) {
        return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, { statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: err.message });
    }
}
exports.default = createAccount;
;
//# sourceMappingURL=create-account.js.map