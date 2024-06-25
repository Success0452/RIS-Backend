"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allCategories = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../util/response");
const util_1 = require("../../util");
const categories_1 = require("../../models/categories");
const allCategories = async (_event) => {
    try {
        const tokenRes = await (0, util_1.verifyToken)(_event.headers.Authorization || _event.headers.authorization);
        if (tokenRes.StatusCodes !== 200) {
            return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.BAD_REQUEST, { statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST, message: tokenRes.message });
        }
        const categories = await categories_1.default.findAll();
        return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.OK, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: `categories fetched successfully`,
            data: categories,
        });
    }
    catch (err) {
        return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, { statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: err.message });
    }
};
exports.allCategories = allCategories;
//# sourceMappingURL=all-categories.js.map