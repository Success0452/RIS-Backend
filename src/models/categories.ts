import { Model, DataTypes } from 'sequelize';
import sequelize from './index';

class Categories extends Model {}

Categories.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            unique: true,
        },
        userId: {
            type: new DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'categories',
        modelName: "Category",
        createdAt: "created_at",
        updatedAt: "updated_at",
        sequelize,
    }
);

Categories.sequelize.sync()
    .then(() => {
        console.log('Categories table created or already exists.');
    })
    .catch((error: any) => {
        console.error('Error creating Categories table:', error);
    });

export default Categories;
