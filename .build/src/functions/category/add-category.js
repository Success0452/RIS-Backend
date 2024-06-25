"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewCategory = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../util/response");
const util_1 = require("../../util");
const categories_1 = require("../../models/categories");
const addNewCategory = async (_event) => {
    try {
        const { name } = JSON.parse(_event.body);
        const tokenRes = await (0, util_1.verifyToken)(_event.headers.Authorization || _event.headers.authorization);
        if (tokenRes.StatusCodes !== 200) {
            return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.BAD_REQUEST, { statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST, message: tokenRes.message });
        }
        if (!name) {
            return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.BAD_REQUEST, { statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'please name field is required' });
        }
        const user = tokenRes.user;
        const checkExistingName = await categories_1.default.findOne({ where: { name: name } });
        if (checkExistingName) {
            return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.BAD_REQUEST, { statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST, message: `category with same name already exists` });
        }
        await categories_1.default.create({
            name: name,
            userId: user.id
        });
        return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.CREATED, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            message: `category created successfully`,
        });
    }
    catch (err) {
        return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, { statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: err.message });
    }
};
exports.addNewCategory = addNewCategory;
//# sourceMappingURL=add-category.js.map