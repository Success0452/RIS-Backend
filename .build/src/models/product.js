"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
class Product extends sequelize_1.Model {
}
Product.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false
    },
    description: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    price: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    quantity: {
        type: new sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    categoryId: {
        type: new sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: new sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'products',
    modelName: "Product",
    createdAt: "created_at",
    updatedAt: "updated_at",
    sequelize: index_1.default,
});
Product.sequelize.sync()
    .then(() => {
    console.log('Product table created or already exists.');
})
    .catch((error) => {
    console.error('Error creating Product table:', error);
});
exports.default = Product;
//# sourceMappingURL=product.js.map