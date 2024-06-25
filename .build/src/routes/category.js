"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListOfAllCategories = exports.addCategory = void 0;
const add_category_1 = require("../functions/category/add-category");
const all_categories_1 = require("../functions/category/all-categories");
const addCategory = async (_event) => {
    return (0, add_category_1.addNewCategory)(_event);
};
exports.addCategory = addCategory;
const getListOfAllCategories = async (_event) => {
    return (0, all_categories_1.allCategories)(_event);
};
exports.getListOfAllCategories = getListOfAllCategories;
//# sourceMappingURL=category.js.map