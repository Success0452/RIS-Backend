"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewProduct = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../util/response");
const util_1 = require("../../util");
const categories_1 = require("../../models/categories");
const product_1 = require("../../models/product");
const addNewProduct = async (_event) => {
    try {
        const { name, description, quantity, price, categoryId } = JSON.parse(_event.body);
        const tokenRes = await (0, util_1.verifyToken)(_event.headers.Authorization || _event.headers.authorization);
        if (tokenRes.StatusCodes !== 200) {
            return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.BAD_REQUEST, { statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST, message: tokenRes.message });
        }
        const user = tokenRes.user;
        const category = await categories_1.default.findByPk(categoryId);
        if (!category) {
            return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.BAD_REQUEST, { statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST, message: `Invalid categoryId: ${categoryId}` });
        }
        const categoryObject = category.toJSON();
        await product_1.default.create({
            name: name,
            description: description,
            quantity: quantity,
            categoryId: categoryObject.id,
            price: price,
            userId: user.id
        });
        return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.CREATED, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            message: `product created successfully`,
        });
    }
    catch (err) {
        return (0, response_1.createResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, { statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: err.message });
    }
};
exports.addNewProduct = addNewProduct;
//# sourceMappingURL=add-product.js.map