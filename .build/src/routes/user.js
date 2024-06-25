"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutAccount = exports.loginAccount = exports.registerAccount = void 0;
const create_account_1 = require("../functions/user/create-account");
const logout_1 = require("../functions/user/logout");
const login_1 = require("../functions/user/login");
const registerAccount = async (_event) => {
    return (0, create_account_1.default)(_event);
};
exports.registerAccount = registerAccount;
const loginAccount = async (_event) => {
    return (0, login_1.default)(_event);
};
exports.loginAccount = loginAccount;
const logoutAccount = async (_event) => {
    return (0, logout_1.default)(_event);
};
exports.logoutAccount = logoutAccount;
//# sourceMappingURL=user.js.map