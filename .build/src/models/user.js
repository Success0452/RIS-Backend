"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    password: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    active: {
        type: new sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
}, {
    tableName: 'users',
    modelName: "User",
    createdAt: "created_at",
    updatedAt: "updated_at",
    sequelize: index_1.default,
});
User.sequelize.sync()
    .then(() => {
    console.log('User table created or already exists.');
})
    .catch((error) => {
    console.error('Error creating User table:', error);
});
exports.default = User;
//# sourceMappingURL=user.js.map