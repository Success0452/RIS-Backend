"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../util/response");
const util_1 = require("../../util");
const product_1 = require("../../models/product");
const updateProduct = async (_event) => {
    try {
        const { productId, name, description, quantity, price, categoryId } = JSON.parse(_event.body);
        const tokenRes = await (0, util_1.verifyToken)(_event.headers.Authorization || _event.headers.authorization);
        if (tokenRes.StatusCodes !== 200) {
            return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.BAD_REQUEST, { statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST, message: tokenRes.message });
        }
        if (!productId) {
            return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.BAD_REQUEST, { statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST, message: `productId not provided` });
        }
        const product = await product_1.default.findByPk(productId);
        const productObject = await product.toJSON();
        await product.update({
            name: name ?? productObject.name,
            description: description ?? productId.description,
            quantity: quantity ?? productObject.quantity,
            categoryId: categoryId ?? productObject.categoryId,
            price: price ?? productObject.price
        });
        return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.OK, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: `product updated successfully`
        });
    }
    catch (err) {
        return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, { statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: err.message });
    }
};
exports.updateProduct = updateProduct;
//# sourceMappingURL=update-product.js.map