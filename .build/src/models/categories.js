"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
class Categories extends sequelize_1.Model {
}
Categories.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    userId: {
        type: new sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'categories',
    modelName: "Category",
    createdAt: "created_at",
    updatedAt: "updated_at",
    sequelize: index_1.default,
});
Categories.sequelize.sync()
    .then(() => {
    console.log('Categories table created or already exists.');
})
    .catch((error) => {
    console.error('Error creating Categories table:', error);
});
exports.default = Categories;
//# sourceMappingURL=categories.js.map