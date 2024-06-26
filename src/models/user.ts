import { Model, DataTypes } from 'sequelize';
import sequelize from './index';

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            unique: true,
        },
        password: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        active: {
            type: new DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }
    },
    {
        tableName: 'users',
        modelName: "User",
        createdAt: "created_at",
        updatedAt: "updated_at",
        sequelize,
    }
);

export default User;
