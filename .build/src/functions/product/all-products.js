"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allProducts = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../util/response");
const util_1 = require("../../util");
const product_1 = require("../../models/product");
const allProducts = async (_event) => {
    try {
        const tokenRes = await (0, util_1.verifyToken)(_event.headers.Authorization || _event.headers.authorization);
        if (tokenRes.StatusCodes !== 200) {
            return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.BAD_REQUEST, { statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST, message: tokenRes.message });
        }
        const products = await product_1.default.findAll();
        return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.OK, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: `products fetched successfully`,
            data: products ?? [],
        });
    }
    catch (err) {
        return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, { statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: err.message });
    }
};
exports.allProducts = allProducts;
//# sourceMappingURL=all-products.js.map