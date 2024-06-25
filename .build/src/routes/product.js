"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExistingProduct = exports.deleteExistingProduct = exports.getListOfProducts = exports.addProduct = void 0;
const add_product_1 = require("../functions/product/add-product");
const all_products_1 = require("../functions/product/all-products");
const delete_product_1 = require("../functions/product/delete-product");
const update_product_1 = require("../functions/product/update-product");
const addProduct = async (_event) => {
    return (0, add_product_1.addNewProduct)(_event);
};
exports.addProduct = addProduct;
const getListOfProducts = async (_event) => {
    return (0, all_products_1.allProducts)(_event);
};
exports.getListOfProducts = getListOfProducts;
const deleteExistingProduct = async (_event) => {
    return (0, delete_product_1.deleteProduct)(_event);
};
exports.deleteExistingProduct = deleteExistingProduct;
const updateExistingProduct = async (_event) => {
    return (0, update_product_1.updateProduct)(_event);
};
exports.updateExistingProduct = updateExistingProduct;
//# sourceMappingURL=product.js.map