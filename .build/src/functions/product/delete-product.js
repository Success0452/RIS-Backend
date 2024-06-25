"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../util/response");
const util_1 = require("../../util");
const product_1 = require("../../models/product");
const deleteProduct = async (_event) => {
    try {
        const { productId } = JSON.parse(_event.body);
        const tokenRes = await (0, util_1.verifyToken)(_event.headers.Authorization || _event.headers.authorization);
        if (tokenRes.StatusCodes !== 200) {
            return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.BAD_REQUEST, { statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST, message: tokenRes.message });
        }
        if (!productId) {
            return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.BAD_REQUEST, { statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST, message: `productId not provided` });
        }
        const product = await product_1.default.findByPk(productId);
        await product.destroy();
        return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.OK, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: `product deleted successfully`
        });
    }
    catch (err) {
        return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, { statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: err.message });
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=delete-product.js.map