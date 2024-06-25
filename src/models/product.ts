import { Model, DataTypes } from 'sequelize';
import sequelize from './index';

class Product extends Model {}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false
        },
        description: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        price: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        quantity: {
            type: new DataTypes.INTEGER,
            allowNull: false,
        },
        categoryId: {
            type: new DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: new DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'products',
        modelName: "Product",
        createdAt: "created_at",
        updatedAt: "updated_at",
        sequelize,
    }
);

export default Product;
